// ----- REQUIREMENTS -----
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp; // library for asynchronous recursive file & directory copying
const utils = require('../modules/utils');
const spawn = require('cross-spawn');

// ----- GLOBAL VARIABLES -----
const clientsPath = path.normalize(__dirname + '../../../emails-engine/src/clients');

const campaign = {};

// ----- HELPERS -----
const renderView = (res, view, data, callback) => {
    res.render(view, {
        data: data
    }, callback);
};

// ----- MIDDLEWARES
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

campaign.listCampaigns = (req, res, next) => {    
    res.status(200).json(res.campaigns);
};

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

campaign.addCampaign = (req, res, next) => {
    req.checkBody("name", "Enter a valid name.").isAlphanumeric().isLength({min:3, max: undefined});
    req.checkBody("displayName", "Enter a valid displayName.").isLength({min:3, max: undefined});

    if (req.validationErrors()) return next();

    const campaigns = res.campaigns;

    // Check if this campaign already exists
    if(campaigns.filter(campaign => (campaign.name === req.body.name)).length) {
       return next({
           status: 409,
           message: `A campaign with the name '${req.body.name}' already exists.`
       });
    }

    // no error -> normal processing here

    // duplicate the template
    ncp(`${res.brandPath}/master`, `${res.brandPath}/${req.body.name}`, (err)  => {
        if (err) {
            return next({
                status: 500,
                message: 'An error occured while trying to duplicate the master template.'
            });
        }

        // add the new campaign to the json file
        const newCampaign = {
            name: req.body.name,
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
        fs.rename(`${res.brandPath}/${req.body.name}/scss/app_${req.params.brandSlug}_master.scss`, `${res.brandPath}/${req.body.name}/scss/app_${req.params.brandSlug}_${req.body.name}.scss`, (err) => {
            return next({
                status: 500,
                message: `An error occured while renaming the scss file.`
            });
        });

        // change the css path in the layout
        // TO DO

        // return the new campaign
        res.status(200).json(newCampaign);
    });
};

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
    res.status(200).json(campaignStructure);
};

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

    // Contrôle si langue inexistante
    const langArr = Object.keys(campaignConfig.lang);
    const newCampaignBlocksLanguages = utils.flatten(newCampaignStructure.map(block => block.lang)).filter((item, pos, self) => self.indexOf(item) == pos);
    for(let lang of newCampaignBlocksLanguages) {
        if(!langArr.includes(lang)) {
            return next({
                status: 422,
                message: `The lang '${lang}' does not exist for this campaign.`
            });
        }
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

campaign.buildCampaign = (req, res, next) => {

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
            structure: sortedStructure
        }, (err, structure) => {
            if(err) return next({
                status: 500,
                message: "Something unexpected happened while rendering the campaign structure file."
            });
            
            try {
                fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/pages/index-${lang}.html`, structure, 'utf8');
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return next({
                        status: 500,
                        message: `Something unexpected happened while writing the file  'index-${lang}.html'.`
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
            dataLang: campaignData
        }, (err, data) => {
            if(err) return next({
                status: 500,
                message: "Something unexpected happened while rendering the campaign data files."
            });

            try {
                fs.writeFileSync(`${res.brandPath}/${req.params.campaignSlug}/data/lang-${lang}.yml`, data, 'utf8');
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

    console.log('BUILD IN PROCESS...');
    const build = spawn('npm run', ['build', `${req.params.brandSlug}/${req.params.campaignSlug}`], {
        cwd: path.normalize(__dirname + '../../../emails-engine')
    });

    build.on('close', (code) => {
        if (code === 0) {
            // BUILD SUCCESS
            console.log('BUILD SUCCESS');
            const campaignLanguages = Object.keys(campaignConfig.lang);
            result = campaignLanguages.map((lang) => `${req.protocol}://${req.get('host')}/${req.params.brandSlug}/${req.params.campaignSlug}/index-${lang}.html`);

            res.status(200).json({
                previewLinks: result
            });
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
        return next({
            status: 500,
            message: 'Something unexpected happened while executing the task.'
        });
    });
};

campaign.zipCampaign = (req, res, next) => {
    console.log('ZIP CREATION IN PROGRESS...');

    const zip = spawn('npm run', ['zip', `${req.params.brandSlug}/${req.params.campaignSlug}`], {
        cwd: path.normalize(__dirname + '../../../emails-engine')
    });

    zip.on('close', (code) => {
        if (code === 0) {
            // ZIP CREATION SUCCESS
            console.log('ZIP CREATION SUCCESS');
            res.status(200).json({
                zipLink: `${req.protocol}://${req.get('host')}/dist/${req.params.brandSlug}_${req.params.campaignSlug}.zip`
            });
        } else {
            // ERROR
            return next({
                status: 500,
                message: `Something unexpected happened while executing the task. The task closed with error code '${code}'`
            });
        }
    });

    zip.on('error', (err) => {
        // ERROR
        return next({
            status: 500,
            message: 'Something unexpected happened while executing the task.'
        });
    });
};

module.exports = campaign;