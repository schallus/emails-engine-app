'use strict';

// ----- REQUIREMENTS -----

// vendor
const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const validator = require('express-validator');

// custom
const brandCtrl = require('./api.brand');
const campaignCtrl = require('./api.campaign');
const imageCtrl = require('./api.image');
const emailCtrl = require('./api.email');

// Create API router
const router = new express.Router();

// ----- MIDDLEWARES -----

router.use(validator());
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json({
    limit: '5mb'
}));

/**
 * @apiDefine DataFormUrlencoded
 * @apiDescription The parameters must be provided using the x-www-form-urlencoded format.
 * @apiHeader {String} Content-Type x-www-form-urlencoded
 */

/**
 * @apiDefine ServerTimeout
 *
 * @apiError (522) {Object} ConnectionTimeOut Connection Timed Out after 5 seconds.
 *
 * @apiErrorExample Error-Timed-Out:
 *     HTTP/1.1 522 Connection Timed Out
 *     {
 *       "error": {
 *          "status": 522,
 *          "message": "Connection Timed Out."
 *       }
 *     }
 */

// ----- ROUTES -----

// ----- image -----
router.route('/brands/:brandSlug/campaigns/:campaignSlug/images')
    .post(timeout('5s'), imageCtrl.addImage)
    .delete(timeout('5s'), imageCtrl.removeImage);

// ----- brand -----
router.route('/brands')
    .get(timeout('5s'), brandCtrl.readBrands, brandCtrl.listBrands)
    .post(timeout('5s'), brandCtrl.readBrands, brandCtrl.addBrand);

// ----- email campaigns -----
router.route('/brands/:brandSlug/campaigns')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.listCampaigns)
    .post(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.addCampaign);

router.route('/brands/:brandSlug/blocks')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.getBrandBlocks);

router.route('/brands/:brandSlug/campaigns/:campaignSlug')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.getCampaignConfig)
    .post(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.setCampaignConfig);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/structure')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.getCampaignStructure)
    .post(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.setCampaignStructure);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/blocks')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.getBlocksData)
    .post(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.addBlockData)
    .put(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.setBlocksData);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/blocks/:blockName')
    .get(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.getBlocksData)
    .put(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.addBlockData)
    .delete(timeout('5s'), campaignCtrl.readCampaigns, campaignCtrl.removeBlockData);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/build')
    .post(timeout('60s'), campaignCtrl.readCampaigns, campaignCtrl.compileJSONIntoYaml, campaignCtrl.buildCampaign, campaignCtrl.getPreviewLinks);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/zip')
    .post(timeout('60s'), campaignCtrl.readCampaigns, campaignCtrl.compileJSONIntoYaml, campaignCtrl.zipCampaign);

router.route('/brands/:brandSlug/recipients')
    .get(timeout('5s'), campaignCtrl.readCampaigns, emailCtrl.getRecipients);

router.route('/brands/:brandSlug/campaigns/:campaignSlug/send')
    .post(timeout('60s'), campaignCtrl.readCampaigns, campaignCtrl.compileJSONIntoYaml, campaignCtrl.buildCampaign, emailCtrl.sendTest);

router.all('*', (req, res, next) => {
    next({
        status: 404,
        message: "This endpoint doesn't exist",
    });
});

// ----- ERROR MIDDLEWARE -----

router.use((err, req, res, next) => {
    console.log(err);
    if (req.validationErrors()) {
        return res.status(422).json({
            error: {
                status: 422,
                message: req.validationErrors().map(e => e.msg).filter((elem, pos, arr) => arr.indexOf(elem) == pos)
            }
        });
    }
    if (err.code === 'ETIMEDOUT') {
        return res.status(522).json({
            error: {
                status: 522,
                message: 'Connection Timed Out.',
            },
        });
    }
    if (err.status && err.message) {
        res.status(err.status).json({
            error: {
                status: err.status,
                message: err.message,
            },
        });
    }
    // map unexpected errors to default format
    return res.status(500).json({
        error: {
            status: 500,
            message: 'Something unexpected happened',
        },
    });
});

module.exports = router;