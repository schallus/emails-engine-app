// ----- REQUIREMENTS -----
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp; // library for asynchronous recursive file & directory copying
const spawn = require('cross-spawn');
const utils = require('../lib/utils');
const textUtils = require('../lib/text');
const fileUtils = require('../lib/fs');
const snapshot = require('../lib/snapshot');


// ----- GLOBAL VARIABLES -----
const distPath = path.normalize(__dirname + '../../../emails-engine/dist');
const clientsPath = path.normalize(__dirname + '../../../emails-engine/src/clients');

const campaign = {};

// ----- HELPERS -----
const renderView = (res, view, data, callback) => {
    res.render(view, {
        data: data
    }, callback);
};

/**
 * @apiDefine BrandNotFound
 *
 * @apiError (Error 4xx) {404} BrandNotFound The brand given in the url does not exist.
 *
 * @apiErrorExample BrandNotFound:
 *  HTTP/1.1 404 Not Found
 *   {
 *     "error": {
 *        "status": 404,
 *        "message": "The brand '%brandName%' does not exist."
 *     }
 *   }
 */

 /**
 * @apiDefine CampaignNotFound
 *
 * @apiError (Error 4xx) {404} CampaignNotFound The campaign given in the url does not exist.
 *
 * @apiErrorExample CampaignNotFound:
 *  HTTP/1.1 404 Not Found
 *   {
 *     "error": {
 *        "status": 404,
 *        "message": "The campaign with the name '%campaignName%' does not exist."
 *     }
 *   }
 */
campaign.readCampaigns = (req, res, next) => {
    const brandSlug = req.params.brandSlug;
    res.brandPath = `${clientsPath}/${brandSlug}`;
    
    try {
        res.campaigns = JSON.parse(fs.readFileSync(`${res.brandPath}/campaigns.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 404,
                message: `The brand '${brandSlug}' does not exist.`
            });
        } else {
            return next();
        }
    }

    next();
};


// ----- ROUTES -----

/**
 * @api {get} /brands/:brandSlug/campaigns List all the campaigns
 * @apiName GetCampaignsList
 * @apiGroup Campaigns
 * @apiDescription Return the list of all the campaigns.
 * No parameters are required for this endpoint. 
 *
 * @apiSuccess {Campaign[]} Object Array of campaigns
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *       "name": "campagneDeDemonstration",
 *        "displayName": "Campagne de démonstration",
 *        "createdAt": "2018-07-06T06:49:37.531Z"
 *    },
 *    {
 *        "name": "nouvelleNewsletter",
 *        "displayName": "Nouvelle Newsletter",
 *        "createdAt": "2018-07-10T14:11:24.148Z"
 *    },
 *  ]
 * 
 * @apiUse ServerTimeout
 * 
 */
campaign.listCampaigns = (req, res, next) => {    
    res.status(200).json(res.campaigns);
};


/**
 * @api {get} /brands/:brandSlug/blocks Get brand blocks
 * @apiName GetBrandBlocks
 * @apiGroup Campaigns
 * @apiDescription Return the list of all the blocks in the brand.
 * No parameters are required for this endpoint. 
 *
 * @apiSuccess {Blocks[]} Object Array of blocks
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "name": "blockName",
 *          "displayName": "Block Name",
 *          "thumbnailUrl": "/public/brand/images/img.jpg",
 *          "properties": [...]
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 5xx) {500} ErrorReadingBlocks Something unexpected happened while reading the blocks configuration file.
 *
 * @apiErrorExample ErrorReadingBlocks:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the blocks configuration file."
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.getBrandBlocks = (req, res, next) => {
    try {
        blocks = JSON.parse(fs.readFileSync(`${res.brandPath}/blocks.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the blocks configuration file."
            });
        } else {
            return next();
        }
    }
    res.status(200).json(blocks);
};

/**
 * @api {post} /brands/:brandSlug/campaigns Add a new campaign
 * @apiName addCampaign
 * @apiGroup Campaigns
 * @apiDescription Add a new campaign.
 * 
 * @apiParam {String} displayName  Name of the campaign to be created.
 *
 * @apiSuccess {Campaign} Object Campaign created
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "name": "nouvelleNewsletter",
 *      "displayName": "Nouvelle Newsletter",
 *      "createdAt": "2018-07-10T14:11:24.148Z"
 *  },
 * 
 * @apiError (Error 4xx) {422} DisplayNameInvalid Enter a valid display name.
 *
 * @apiErrorExample DisplayNameInvalid:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "Enter a valid displayName."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} MasterDuplicationError An error occured while trying to duplicate the master template.
 *
 * @apiErrorExample MasterDuplicationError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while trying to duplicate the master template."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} CampainsFileNotFound The file 'campaigns.json' does not exist.
 *
 * @apiErrorExample CampainsFileNotFound:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "The file 'campaigns.json' does not exist."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} RenamingStylesheetError An error occured while renaming the scss file.
 *
 * @apiErrorExample RenamingStylesheetError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while renaming the scss file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingLayoutFile An error occured while reading the layout file.
 *
 * @apiErrorExample ErrorReadingLayoutFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while reading the layout file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingLayoutFile An error occured while writing the layout file.
 *
 * @apiErrorExample ErrorWritingLayoutFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while writing the layout file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */

 /**
 * @api {patch} /brands/:brandSlug/campaigns Rename a campaign
 * @apiName renameCampaign
 * @apiGroup Campaigns
 * @apiDescription Rename an existing campaign.
 * 
 * @apiParam {String} displayName  New name of the campaign.
 *
 * @apiSuccess {Campaign} Object Campaign updated
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "name": "nouvelleNewsletter",
 *      "displayName": "Nouveau nom de la campagne",
 *      "createdAt": "2018-07-10T14:11:24.148Z"
 *  },
 * 
 * @apiError (Error 4xx) {422} DisplayNameInvalid Enter a valid display name.
 *
 * @apiErrorExample DisplayNameInvalid:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "Enter a valid displayName."
 *           ]
 *       }
 *   }
 *
 * @apiError (Error 5xx) {500} ErrorWritingCampaignFile An error occured while writing the campaign file.
 * 
 * @apiErrorExample ErrorWritingCampaignFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while writing the campaign file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * @apiUse CampaignNotFound
 * 
 */
campaign.addCampaign = (req, res, next) => {

    let edit = false;
    if (req.method == 'PATCH' && req.params.campaignSlug) edit = true;

    req.checkBody("displayName", "Enter a valid displayName.").isLength({min:3, max: undefined});

    if (req.validationErrors()) return next();

    const campaigns = res.campaigns;

    // If edition mode and campaign does not exist
    if(edit && !campaigns.filter(campaign => (campaign.name === req.params.campaignSlug)).length == 1) {
        return next({
            status: 404,
            message: `The campaign with the name '${req.params.campaignSlug}' does not exist.`
        });
    }

    if(!edit) {
        // Add new campaign

        // Generate a campaign name
        const generatedName = textUtils.formatCampaignName(req.body.displayName);
        let name = generatedName;

        let i = 1;
        while (campaigns.filter(campaign => (campaign.name === name)).length == 1) {
            name = `${generatedName}${i}`;
            i++;
        }

        // duplicate the template
        ncp(`${res.brandPath}/master`, `${res.brandPath}/${name}`, (err)  => {
            if (err) {
                return next({
                    status: 500,
                    message: 'An error occured while trying to duplicate the master template.'
                });
            }

            // add the new campaign to the json file
            const newCampaign = {
                name: name,
                displayName: req.body.displayName,
                createdAt: new Date()
            };

            campaigns.push(newCampaign);

            const fileContent = JSON.stringify(campaigns, null, "\t");
            try {
                fs.writeFileSync(`${res.brandPath}/campaigns.json`, fileContent, 'utf8');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return next({
                        status: 500,
                        message: `The file 'campaigns.json' does not exist.`
                    });
                } else {
                    return next();
                }
            }

            // renaming of the campaign scss file
            fs.rename(`${res.brandPath}/${name}/scss/app_${req.params.brandSlug}_master.scss`, `${res.brandPath}/${name}/scss/app_${req.params.brandSlug}_${name}.scss`, (err) => {
                if (err) return next({
                    status: 500,
                    message: `An error occured while renaming the scss file.`
                });
            });

            // change the css path in the layout
            const layoutFilePath = `${res.brandPath}/${name}/layouts/default.html`;
            fs.readFile(layoutFilePath, 'utf8', (err, data) => {
                if (err) {
                    return next({
                        status: 500,
                        message: `An error occured while reading the layout file.`
                    });
                }

                const toBeReplaced = `app_${req.params.brandSlug}_master.css`;
                const replacement = `app_${req.params.brandSlug}_${name}.css`;
                const re = new RegExp(toBeReplaced,"g");
                const result = data.replace(re, replacement);
            
                fs.writeFile(layoutFilePath, result, 'utf8', (err) => {
                if (err) return next({
                        status: 500,
                        message: `An error occured while writing the layout file.`
                    });
                    // return the new campaign
                    res.status(200).json(newCampaign);
                });
            });
        });
    } else {
        // Edit the campaign
        const campaign = campaigns.filter(el => el.name == req.params.campaignSlug)[0]
        campaign.displayName = req.body.displayName;
        campaign.updatedAt = new Date();

        const result = JSON.stringify(campaigns, null, "\t");

        fs.writeFile(`${res.brandPath}/campaigns.json`, result, 'utf8', (err) => {
        if (err) return next({
                status: 500,
                message: `An error occured while writing the campaigns file.`
            });

            // return the new campaign
            res.status(200).json(campaign);
        });
    }
};


/**
 * @api {delete} /brands/:brandSlug/campaigns/:campaignSlug/archive Archive a campaign
 * @apiName archiveCampaign
 * @apiGroup Campaigns
 * @apiDescription Archive a campaign. An archived campaign can be restored. If you want to restore an archived campaign, please contact the server administrator.
 *
 * @apiSuccess {HttpRequestSuccess} Success Success 200
 * 
 * @apiSuccessExample {text} Success-Response:
 *  HTTP/1.1 200 OK
 * 
 * @apiError (Error 5xx) {500} ErrorArchive Something unexpected happened while moving the campaign to the archive folder.
 *
 * @apiErrorExample ErrorArchive:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while moving the campaign to the archive folder."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingCampaignFile An error occured while writing the campaigns file.
 *
 * @apiErrorExample ErrorWritingCampaignFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while writing the campaigns file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.archiveCampaign = (req, res, next) => {
    fileUtils.moveFolder(`${res.brandPath}/${req.params.campaignSlug}`, `${res.brandPath}/archives/${req.params.campaignSlug}`, (err) => {
        if (err) return next({
            status: 500,
            message: 'Something unexpected happened while moving the campaign to the archive folder.'
        });

        // Delete from dist folder
        fileUtils.deleteFolderRecursive(`${distPath}/${req.params.brandSlug}/${req.params.campaignSlug}`);

        const filteredCampaigns = res.campaigns.filter(el => el.name !== req.params.campaignSlug)
        const result = JSON.stringify(filteredCampaigns, null, "\t");

        fs.writeFile(`${res.brandPath}/campaigns.json`, result, 'utf8', (err) => {
        if (err) return next({
                status: 500,
                message: `An error occured while writing the campaigns file.`
            });

            // success
            res.status(200).send();
        });
    });
};

/**
 * @api {delete} /brands/:brandSlug/campaigns/:campaignSlug/delete Delete a campaign
 * @apiName deleteCampaign
 * @apiGroup Campaigns
 * @apiDescription Delete a campaign. Be aware, a deleted campaign cannot be restored.
 *
 * @apiSuccess {HttpRequestSuccess} Success Success 200
 * 
 * @apiSuccessExample {text} Success-Response:
 *  HTTP/1.1 200 OK
 * 
 * @apiError (Error 5xx) {500} ErrorWritingCampaignFile An error occured while writing the campaigns file.
 *
 * @apiErrorExample ErrorWritingCampaignFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while writing the campaigns file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.deleteCampaign = (req, res, next) => {
    // Delete from src/clients folder
    fileUtils.deleteFolderRecursive(`${res.brandPath}/${req.params.campaignSlug}`);
    // Delete from dist folder
    fileUtils.deleteFolderRecursive(`${distPath}/${req.params.brandSlug}/${req.params.campaignSlug}`);

    const filteredCampaigns = res.campaigns.filter(el => el.name !== req.params.campaignSlug)
    const result = JSON.stringify(filteredCampaigns, null, "\t");

    fs.writeFile(`${res.brandPath}/campaigns.json`, result, 'utf8', (err) => {
    if (err) return next({
            status: 500,
            message: `An error occured while writing the campaigns file.`
        });

        // success
        res.status(200).send();
    });
};

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/duplicate Duplicate a campaign
 * @apiName duplicateCampaign
 * @apiGroup Campaigns
 * @apiDescription Duplicate a campaign.
 * 
 * @apiParam {String} displayName  Name of the campaign duplicate.
 *
 * @apiSuccess {Campaign} Object New campaign created
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "name": "duplicateACampaign",
 *      "displayName": " Duplicate a campaign",
 *      "createdAt": "2018-07-10T14:11:24.148Z"
 *  },
 * 
 * @apiError (Error 4xx) {422} DisplayNameInvalid Enter a valid display name.
 *
 * @apiErrorExample DisplayNameInvalid:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "Enter a valid displayName."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} DuplicateCampaignError An error occured while trying to duplicate the campaign.
 *
 * @apiErrorExample DuplicateCampaignError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while trying to duplicate the campaign."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} CampainsFileNotFound The file 'campaigns.json' does not exist.
 *
 * @apiErrorExample CampainsFileNotFound:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "The file 'campaigns.json' does not exist."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} RenamingStylesheetError An error occured while renaming the scss file.
 *
 * @apiErrorExample RenamingStylesheetError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while renaming the scss file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingLayoutFile An error occured while reading the layout file.
 *
 * @apiErrorExample ErrorReadingLayoutFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while reading the layout file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingLayoutFile An error occured while writing the layout file.
 *
 * @apiErrorExample ErrorWritingLayoutFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "An error occured while writing the layout file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * @apiUse CampaignNotFound
 * 
 */
campaign.duplicateCampaign = (req, res, next) => {

    req.checkBody("displayName", "Enter a valid displayName.").isLength({min:3, max: undefined});

    if (req.validationErrors()) return next();

    const campaigns = res.campaigns;

    if(!campaigns.filter(campaign => (campaign.name === req.params.campaignSlug)).length == 1) {
        return next({
            status: 409,
            message: `The campaign with the name '${req.params.campaignSlug}' does not exist.`
        });
    }

    const displayName = req.body.displayName;
    const generatedName = textUtils.formatCampaignName(req.body.displayName);
    let name = generatedName;

    let i = 1;
    while (campaigns.filter(campaign => (campaign.name === name)).length == 1) {
        name = `${generatedName}${i}`;
        i++;
    }

    // duplicate the template
    ncp(`${res.brandPath}/${req.params.campaignSlug}`, `${res.brandPath}/${name}`, (err)  => {
        if (err) {
            return next({
                status: 500,
                message: 'An error occured while trying to duplicate the campaign.'
            });
        }

        // add the new campaign to the json file
        const newCampaign = {
            name: name,
            displayName: displayName,
            createdAt: new Date()
        };

        campaigns.push(newCampaign);

        const fileContent = JSON.stringify(campaigns, null, "\t");
        try {
            fs.writeFileSync(`${res.brandPath}/campaigns.json`, fileContent, 'utf8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                return next({
                    status: 500,
                    message: `The file 'campaigns.json' does not exist.`
                });
            } else {
                return next();
            }
        }

        // renaming of the campaign scss file
        fs.rename(`${res.brandPath}/${name}/scss/app_${req.params.brandSlug}_${req.params.campaignSlug}.scss`, `${res.brandPath}/${name}/scss/app_${req.params.brandSlug}_${name}.scss`, (err) => {
            if (err) return next({
                status: 500,
                message: `An error occured while renaming the scss file.`
            });
        });

        // change the css path in the layout
        const layoutFilePath = `${res.brandPath}/${name}/layouts/default.html`;
        fs.readFile(layoutFilePath, 'utf8', (err, data) => {
            if (err) {
                return next({
                    status: 500,
                    message: `An error occured while reading the layout file.`
                });
            }

            const toBeReplaced = `app_${req.params.brandSlug}_${req.params.campaignSlug}.css`;
            const replacement = `app_${req.params.brandSlug}_${name}.css`;
            const re = new RegExp(toBeReplaced,"g");
            const result = data.replace(re, replacement);
        
            fs.writeFile(layoutFilePath, result, 'utf8', (err) => {
            if (err) return next({
                    status: 500,
                    message: `An error occured while writing the layout file.`
                });
                // return the new campaign
                res.status(200).json(newCampaign);
            });
        });
    });
};


/**
 * @api {get} /brands/:brandSlug/campaigns/:campaignSlug Get campaign config
 * @apiName getCampaignConfig
 * @apiGroup Campaigns
 * @apiDescription Get the campaign configuration such as the campaign languages, the emails subjects, etc.
 *
 * @apiSuccess {CampaignConfig} Object Campaign configuration
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "lang": {
 *          "fr": {
 *              "subject": "Sujet en FR"
 *          },
 *          "de": {
 *              "subject": "Sujet en DE"
 *          },
 *          "fr-CH": {
 *              "subject": "Sujet en fr-CH"
 *          }
 *      },
 *      "customLang": ['fr-CH'],
 *      "masterLang": "fr",
 *      "layout": "default"
 *  }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingConfigurationFile An error occured while reading the campaign configuration file.
 *
 * @apiErrorExample ErrorReadingConfigurationFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign configuration file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.getCampaignConfig = (req, res, next) => {
    try {
        campaignConfig = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/config.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign configuration file."
            });
        } else {
            return next();
        }
    }
    res.status(200).json(campaignConfig);
};

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug Set campaign config
 * @apiName setCampaignConfig
 * @apiGroup Campaigns
 * @apiDescription Set the campaign configuration such as the campaign languages, the emails subjects, etc.
 *
 * @apiParam {Object} campaignConfig Campaign configuration
 * 
 * @apiSuccess {CampaignConfig} Object New campaign configuration
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "lang": {
 *          "fr": {
 *              "subject": "Sujet en FR"
 *          },
 *          "de": {
 *              "subject": "Sujet en DE"
 *          },
 *          "fr-CH": {
 *              "subject": "Sujet en fr-CH"
 *          }
 *      },
 *      "customLang": ['fr-CH'],
 *      "masterLang": "fr",
 *      "layout": "default"
 *  }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingConfigurationFile Something unexpected happened while writing the campaign configuration file.
 *
 * @apiErrorExample ErrorWritingConfigurationFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while writing the campaign configuration file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.setCampaignConfig = (req, res, next) => {

    const newCampaignConfig = req.body;

    try {
        fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/config.json`, JSON.stringify(newCampaignConfig, null, "\t"), 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while writing the campaign configuration file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    res.status(200).json(newCampaignConfig);
};

/**
 * @api {get} /brands/:brandSlug/campaigns/:campaignSlug/structure Get campaign structure
 * @apiName getCampaignStructure
 * @apiGroup Campaigns
 * @apiDescription Get the campaign structure
 * 
 * @apiSuccess {BlockPosition[]} Object Structure of the newsletter
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "blockType": "header-01",
 *          "position": 0,
 *          "name": "header-01-1531231933395",
 *          "valid": true
 *      },
 *      {
 *          "blockType": "header-02",
 *          "position": 1,
 *          "name": "header-02-1531231935137",
 *          "valid": true
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 5xx) {500} ErrorReadingStructureFile Something unexpected happened while reading the campaign structure file.
 *
 * @apiErrorExample ErrorReadingStructureFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign structure file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.getCampaignStructure = (req, res, next) => {
    try {
        campaignStructure = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/pages/structure.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign structure file."
            });
        } else {
            return next();
        }
    }
    res.status(200).json(campaignStructure);
};

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/structure Set the campaign structure
 * @apiName setCampaignStructure
 * @apiGroup Campaigns
 * @apiDescription Set the campaign structure
 * 
 * @apiParam {BlockPosition[]} campaignStructure Structure of the newsletter
 * 
 * @apiSuccess {BlockPosition[]} Object Structure of the newsletter
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "blockType": "header-01",
 *          "position": 0,
 *          "name": "header-01-1531231933395",
 *          "valid": true
 *      },
 *      {
 *          "blockType": "header-02",
 *          "position": 1,
 *          "name": "header-02-1531231935137",
 *          "valid": true
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 4xx) {422} WrongParameter You must pass an array of Object in the request body.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "You must pass an array of Object in the request body."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingBlocksConfig Something unexpected happened while reading the blocks configuration file.
 *
 * @apiErrorExample ErrorReadingBlocksConfig:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the blocks configuration file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingCampaignConfig Something unexpected happened while reading the campaign configuration file.
 *
 * @apiErrorExample ErrorReadingCampaignConfig:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign configuration file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {422} BlockNotFound The block does not exist.
 *
 * @apiErrorExample BlockNotFound:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "The block '%blockName%' does not exist."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {422} BlockPositionError Two blocks are at the same position.
 *
 * @apiErrorExample BlockPositionError:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "Two blocks are at the same position."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {422} BlockUniqueIdentifierError Two blocks have the same name.
 *
 * @apiErrorExample BlockUniqueIdentifierError:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "Two blocks have the same name."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingStructureFile Something unexpected happened while writing the campaign structure file.
 *
 * @apiErrorExample ErrorWritingStructureFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while writing the campaign structure file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.setCampaignStructure = (req, res, next) => {

    const newCampaignStructure = req.body;

    if(!Array.isArray(newCampaignStructure)) {
        return next({
            status: 422,
            message: "You must pass an array of Object in the request body."
        });
    }

    // Get list blocks available
    try {
        blocks = JSON.parse(fs.readFileSync(`${res.brandPath}/blocks.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the blocks configuration file."
            });
        } else {
            return next();
        }
    }

    // Get campaign config
    try {
        campaignConfig = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/config.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign configuration file."
            });
        } else {
            return next();
        }
    }

    // Contrôle si blocs inexistants
    const blocksArr = blocks.map(block => block.name);
    const newCampaignBlocks = newCampaignStructure.map(block => block.blockType);
    for(let block of newCampaignBlocks) {
        if(!blocksArr.includes(block)) {
            return next({
                status: 422,
                message: `The block '${block}' does not exist.`
            });
        }
    }

    // Contrôle si plusieurs blocs ont la même position
    const positionArr = newCampaignStructure.map((item) => item.position);
    const isPositionDuplicate = positionArr.some((item, idx) => positionArr.indexOf(item) != idx);
    if(isPositionDuplicate) {
        return next({
            status: 422,
            message: `Two blocks are at the same position.`
        });
    }

    // Contrôle si plusieurs blocs ont le même nom
    const nameArr = newCampaignStructure.map((item) => item.name);
    const isNameDuplicate = nameArr.some((item, idx) => nameArr.indexOf(item) != idx);
    if(isNameDuplicate) {
        return next({
            status: 422,
            message: `Two blocks have the same name.`
        });
    }

    try {
        fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/pages/structure.json`, JSON.stringify(newCampaignStructure, null, "\t"), 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while writing the campaign structure file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    res.status(200).json(newCampaignStructure);
};

/**
 * @api {get} /brands/:brandSlug/campaigns/:campaignSlug/blocks Get campaign blocks data
 * @apiName getCampaignBlocksData
 * @apiGroup Campaigns
 * @apiDescription Get the data from all the blocks in the campaign.
 * 
 * @apiSuccess {BlockData[]} Object Data of the newsletter
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "blockName": "header-02-1531231935137",
 *          "languages": [
 *              {
 *                  "lang": "fr",
 *                  "properties": [
 *                      {
 *                          "name": "img",
 *                          "value": "/dist/brandName/demo/images/uploads/logo.png",
 *                          "copiedFromMaster": false
 *                      },
 *                      {
 *                          "name": "url",
 *                          "value": "http://www.wideagency.com/",
 *                          "copiedFromMaster": false
 *                      }
 *                  ],
 *                  "display": true
 *              }
 *          ]
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 5xx) {500} ErrorReadingDataFile Something unexpected happened while reading the campaign data file.
 *
 * @apiErrorExample ErrorReadingDataFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign data file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */

 /**
 * @api {get} /brands/:brandSlug/campaigns/:campaignSlug/blocks/:blockName Get block data by name
 * @apiName getBlockDataByName
 * @apiGroup Campaigns
 * @apiDescription Get the block data for a certain block.
 * 
 * @apiSuccess {BlockData} Object Block data
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "blockName": "header-02-1531231935137",
 *      "languages": [
 *          {
 *              "lang": "fr",
 *              "properties": [
 *                  {
 *                      "name": "img",
 *                      "value": "/dist/brandName/demo/images/uploads/logo.png",
 *                      "copiedFromMaster": false
 *                  },
 *                  {
 *                      "name": "url",
 *                      "value": "http://www.wideagency.com/",
 *                      "copiedFromMaster": false
 *                  }
 *              ],
 *              "display": true
 *          }
 *      ]
 *  }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingDataFile Something unexpected happened while reading the campaign data file.
 *
 * @apiErrorExample ErrorReadingDataFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign data file."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.getBlocksData = (req, res, next) => {
    try {
        campaignData = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign data file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    let filter = false;
    req.params.blockName ? filter = true : null ;

    if(filter) {
        res.status(200).json(campaignData.filter(block => block.blockName == req.params.blockName)[0]);
    } else {
        res.status(200).json(campaignData);
    }
};

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/blocks Add block data
 * @apiName addBlockData
 * @apiGroup Campaigns
 * @apiDescription Add block data to the campaign.
 * 
 * @apiParam {BlockData} blockData Block data
 * 
 * @apiSuccess {BlockData} Object Block data
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "blockName": "header-02-1531231935137",
 *      "languages": [
 *          {
 *              "lang": "fr",
 *              "properties": [
 *                  {
 *                      "name": "img",
 *                      "value": "/dist/brandName/demo/images/uploads/logo.png",
 *                      "copiedFromMaster": false
 *                  },
 *                  {
 *                      "name": "url",
 *                      "value": "http://www.wideagency.com/",
 *                      "copiedFromMaster": false
 *                  }
 *              ],
 *              "display": true
 *          }
 *      ]
 *  }
 * 
 * @apiError (Error 4xx) {422} WrongParameter You must pass the block data in the body.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "You must pass the block data in the body."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingDataFile Something unexpected happened while reading the campaign data file.
 *
 * @apiErrorExample ErrorReadingDataFile:
 *  HTTP/1.1 500 internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign data file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {404} BlockNotFound The block you are trying to update does not exist.
 *
 * @apiErrorExample BlockNotFound:
 *  HTTP/1.1 404 Not Found
 *   {
 *       "error": {
 *           "status": 404,
 *           "message": [
 *               "The block you are trying to update does not exist."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.addBlockData = (req, res, next) => {
    const newBlockData = req.body;

    if(!newBlockData.blockName || !Array.isArray(newBlockData.languages)) {
        return next({
            status: 422,
            message: "You must pass the block data in the body."
        }); 
    }

    let update = false;
    req.params.blockName ? update = true : null ;

    try {
        campaignData = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign data file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    if(update) {
        objIndex = campaignData.findIndex((obj => obj.blockName == req.params.blockName));
    } else {
        objIndex = campaignData.findIndex((obj => obj.blockName == newBlockData.blockName));
    }

    if(objIndex>-1) {
        campaignData[objIndex] = newBlockData;
    } else if(!update) {
        campaignData.push(newBlockData);
    } else {
        return next({
            status: 404,
            message: "The block you are trying to update does not exist."
        });
    }

    try {
        fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, JSON.stringify(campaignData, null, "\t"), 'utf8');
    } catch (err) {
        return next(err);
    }

    res.status(201).json(newBlockData);
};

/**
 * @api {put} /brands/:brandSlug/campaigns/:campaignSlug/blocks Set blocks data
 * @apiName setBlocksData
 * @apiGroup Campaigns
 * @apiDescription Set blocks data. Be aware, this function will overide all the data previously saved.
 * 
 * @apiParam {BlockData[]} blocksData Blocks data
 * 
 * @apiSuccess {BlockData[]} Object Blocks data
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "blockName": "header-02-1531231935137",
 *          "languages": [
 *              {
 *                  "lang": "fr",
 *                  "properties": [
 *                      {
 *                          "name": "img",
 *                          "value": "/dist/brandName/demo/images/uploads/logo.png",
 *                          "copiedFromMaster": false
 *                      },
 *                      {
 *                          "name": "url",
 *                          "value": "http://www.wideagency.com/",
 *                          "copiedFromMaster": false
 *                      }
 *                  ],
 *                  "display": true
 *              }
 *          ]
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 4xx) {422} WrongParameter You must pass an array of blocks data in the body.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": [
 *               "You must pass an array of blocks data in the body."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.setBlocksData = (req, res, next) => {
    const newBlocksData = req.body;

    if(!Array.isArray(newBlocksData)) {
        return next({
            status: 422,
            message: "You must pass an array of blocks data in the body."
        }); 
    } else {
        for (newBlockData of newBlocksData) {
            if(!newBlockData.blockName || !Array.isArray(newBlockData.languages)) {
                return next({
                    status: 422,
                    message: "You must pass an array of blocks data in the body."
                });
            }
        }
    }

    try {
        fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, JSON.stringify(newBlocksData, null, "\t"), 'utf8');
    } catch (err) {
        return next(err);
    }

    res.status(200).json(newBlocksData);
};

/**
 * @api {delete} /brands/:brandSlug/campaigns/:campaignSlug/blocks/:blockName Remove block data
 * @apiName removeBlockData
 * @apiGroup Campaigns
 * @apiDescription Remove the block data.
 * 
 * @apiSuccess {HttpRequestSuccess} Success Success 200
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * 
 * @apiError (Error 5xx) {500} ErrorReadingData Something unexpected happened while reading the campaign data file.
 *
 * @apiErrorExample ErrorReadingData:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign data file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {404} BlockNotFound The block you are trying to remove does not exist.
 *
 * @apiErrorExample BlockNotFound:
 *  HTTP/1.1 404 Not Found
 *   {
 *       "error": {
 *           "status": 404,
 *           "message": [
 *               "The block you are trying to remove does not exist."
 *           ]
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.removeBlockData = (req, res, next) => {
    try {
        campaignData = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign data file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    objIndex = campaignData.findIndex((obj => obj.blockName == req.params.blockName));

    if(objIndex > -1) {
        campaignData.splice(objIndex, 1);
    } else {
        return next({
            status: 404,
            message: "The block you are trying to remove does not exist."
        });
    }

    try {
        fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, JSON.stringify(campaignData, null, "\t"), 'utf8');
    } catch (err) {
        return next(err);
    }

    res.status(200).send();
};


/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/build Build the campaign
 * @apiName buildCampaign
 * @apiGroup Campaigns
 * @apiDescription Build the campaign.
 * 
 * @apiSuccess {Object[]} Object Links to the previews
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "url": "http://yourserverurl.com/dist/brand/campaign/index-fr.html",
 *          "lang": "fr"    
 *      },
 *      {...}
 *  ]
 * 
 * @apiUse buildCampaign
 * @apiUse compileJSON
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.getPreviewLinks = (req, res) => {
    req.previewLinks.forEach(el => delete el.path );
    return res.status(200).json(req.previewLinks);
}

/**
 * @apiDefine compileJSON
 * 
 * @apiError (Error 5xx) {500} CompilationError Something unexpected happened while reading the campaign configuration file.
 *
 * @apiErrorExample CompilationError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign configuration file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingStructure Something unexpected happened while reading the campaign structure file.
 *
 * @apiErrorExample ErrorReadingStructure:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign structure file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingData Something unexpected happened while reading the campaign data file.
 *
 * @apiErrorExample ErrorReadingData:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while reading the campaign data file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorRenderingStructure Something unexpected happened while rendering the campaign structure file.
 *
 * @apiErrorExample ErrorRenderingStructure:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while rendering the campaign structure file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorRenderingStructure Something unexpected happened while rendering the campaign structure file.
 *
 * @apiErrorExample ErrorRenderingStructure:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while rendering the campaign structure file."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorSavingStructure Something unexpected happened while writing the file 'index-%lang%.html'.
 *
 * @apiErrorExample ErrorSavingStructure:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while writing the file 'index-%lang%.html'."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorRenderingData Something unexpected happened while rendering the campaign data files.
 *
 * @apiErrorExample ErrorRenderingData:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while rendering the campaign data files."
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorSavingData Something unexpected happened while writing the file  'lang-%lang%.yml'.
 *
 * @apiErrorExample ErrorSavingData:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while writing the file  'lang-%lang%.yml'."
 *           ]
 *       }
 *   }
 * 
 */
campaign.compileJSONIntoYaml = (req, res, next) => {
    console.log('Compiling campaign files...');
    try {
        campaignConfig = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/config.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign configuration file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    try {
        campaignStructure = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/pages/structure.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign structure file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    try {
        campaignData = JSON.parse(fs.readFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/data-lang.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the campaign data file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    const dataDir = `${res.brandPath}/${req.params.campaignSlug}/data`;
    const pagesDir = `${res.brandPath}/${req.params.campaignSlug}/pages`;

    // Remove all the compiled files from the data directory excepted json files
    fs.readdir(dataDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if (file.indexOf('.json') === -1) {
                fs.unlink(path.join(dataDir, file), err => {
                    if (err) throw err;
                });
            }
        }
    });

    // Remove all the compiled files from the pages directory excepted json files
    fs.readdir(pagesDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            if (file.indexOf('.json') === -1) {
                fs.unlink(path.join(pagesDir, file), err => {
                    if (err) throw err;
                });
            }
        }
    });

    // First we update the /pages folder with the new structure
    for([key, value] of utils.entries(campaignConfig.lang)) {
        const lang = key;
        const subject = value.subject;

        // Sort the campaign structure by position
        // use slice() to copy the array and not just make a reference
        let sortedStructure = campaignStructure.slice(0);
        sortedStructure.sort((a,b) => {
            return a.position - b.position;
        });

        renderView(res, 'structure', {
            subject: subject, 
            emailLayout: campaignConfig.layout,
            lang: lang,
            structure: sortedStructure,
            data: campaignData
        }, (err, structure) => {
            if(err) {
                console.log(err);
                return next({
                    status: 500,
                    message: "Something unexpected happened while rendering the campaign structure file."
                });
            }
            
            try {
                fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/pages/index-${lang}.html`, structure, 'utf8');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return next({
                        status: 500,
                        message: `Something unexpected happened while writing the file 'index-${lang}.html'.`
                    });
                } else {
                    return next();
                }
            }
        });

        renderView(res, 'data-lang', {
            brand: req.params.brandSlug,
            campaign: req.params.campaignSlug,
            lang: lang,
            masterLang: campaignConfig.masterLang,
            dataLang: campaignData
        }, (err, data) => {
            if(err) {
                console.log(err);
                return next({
                    status: 500,
                    message: "Something unexpected happened while rendering the campaign data files."
                });
            }

            try {
                fs.writeFileSync(`${dataDir}/lang-${lang}.yml`, data, 'utf8');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return next({
                        status: 500,
                        message: `Something unexpected happened while writing the file  'lang-${lang}.yml'.`
                    });
                } else {
                    return next();
                }
            }
        });
    }
    console.log('Success compiling campaign files...');
    next();
};

/**
 * @apiDefine buildCampaign
 * 
 * @apiError (Error 5xx) {500} TaskExecutionErrorWithCode Something unexpected happened while executing the task. The task closed with error code '%code%'
 *
 * @apiErrorExample TaskExecutionErrorWithCode:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while executing the task. The task closed with error code '%code%'"
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} TaskExecutionError Something unexpected happened while executing the task.
 *
 * @apiErrorExample TaskExecutionError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while executing the task."
 *           ]
 *       }
 *   }
 * 
 */
campaign.buildCampaign = (req, res, next) => {

    const build = spawn('npm', ['run', 'build', `${req.params.brandSlug}/${req.params.campaignSlug}`], {
        cwd: path.normalize(__dirname + '../../../emails-engine')
    });

    const processId = build.pid;
    console.log(`Build in progress... (pid: ${processId})`);

    const campaignLanguages = Object.keys(campaignConfig.lang);
    const result = campaignLanguages.map((lang) => {
        return {
            path: `${distPath}/${req.params.brandSlug}/${req.params.campaignSlug}/index-${lang}.html`,
            url: `${req.protocol}://${req.get('host')}/dist/${req.params.brandSlug}/${req.params.campaignSlug}/index-${lang}.html`,
            lang: lang
        }
    });

    build.stdout.on('data', (data) => {
        // Log the build output for debugging
        console.log(data.toString());
    });

    build.stderr.on('data', (err) => {
        // Log the build output for debugging
        console.log(err.toString());
    });

    build.on('close', (code) => {
        if (code === 0) {
            // BUILD SUCCESS
            console.log(`Build success! (pid: ${processId})`);

            req.previewLinks = result;
            next();
        } else {
            // ERROR
            return next({
                status: 500,
                message: `Something unexpected happened while executing the task. The task closed with error code '${code}'`
            });
        }
    });

    build.on('error', (err) => {
        // ERROR
        console.log(err);
        return next({
            status: 500,
            message: 'Something unexpected happened while executing the task.'
        });
    });
};

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/zip Zip the campaign
 * @apiName zipCampaign
 * @apiGroup Campaigns
 * @apiDescription Zip the campaign.
 * 
 * @apiSuccess {Object} Object Link to the zip file
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "zipLink": "http://yourserverurl.com/dist/brand_campaign.zip"
 *  }
 * 
 * @apiError (Error 5xx) {500} TaskExecutionErrorWithCode Something unexpected happened while executing the task. The task closed with error code '%code%'
 *
 * @apiErrorExample TaskExecutionErrorWithCode:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while executing the task. The task closed with error code '%code%'"
 *           ]
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} TaskExecutionError Something unexpected happened while executing the task.
 *
 * @apiErrorExample TaskExecutionError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": [
 *               "Something unexpected happened while executing the task."
 *           ]
 *       }
 *   }
 * 
 * @apiUse compileJSON
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
campaign.zipCampaign = (req, res, next) => {

    const zip = spawn('npm', ['run', 'zip', `${req.params.brandSlug}/${req.params.campaignSlug}`], {
        cwd: path.normalize(__dirname + '../../../emails-engine')
    });

    const processId = zip.pid;
    console.log(`Zip creation in progress... (pid: ${processId})`);

    const result = {
        zipLink: `${req.protocol}://${req.get('host')}/dist/${req.params.brandSlug}_${req.params.campaignSlug}.zip`
    };

    zip.stdout.on('data', (data) => {
        // Log the zip output for debugging
        console.log(data.toString());
    });

    zip.stderr.on('data', (err) => {
        // Log the build output for debugging
        console.log(err.toString());
    });

    zip.on('close', (code) => {
        if (code === 0) {
            console.log(`Zip creation success! (pid: ${processId})`);
            res.status(200).json(result);
        } else {
            // ERROR
            return next({
                status: 500,
                message: `Something unexpected happened while executing the task. The task closed with error code '${code}'`
            });
        }
    });

    zip.on('error', (err) => {
        console.log(err);
        // ERROR
        return next({
            status: 500,
            message: 'Something unexpected happened while executing the task.'
        });
    });
};

module.exports = campaign;