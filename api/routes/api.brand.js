// ----- REQUIREMENTS -----
const path = require('path');
const fs = require('fs');
const utils = require('../lib/utils');

// ----- GLOBAL VARIABLES -----
const clientsPath = path.normalize(__dirname + '../../../emails-engine/src/clients');
const brandsListPath = `${clientsPath}/brands.json`;


const brand = {};

// ----- MIDDLEWARES
brand.readBrands = (req, res, next) => {
    try {
        res.brands = JSON.parse(fs.readFileSync(brandsListPath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: `The file 'brands.json' does not exist.`
            });
        } else {
            return next();
        }
    }
    next();
};


// ----- ROUTES -----

/**
 * @api {get} /brands List all the brands
 * @apiName GetBrandsList
 * @apiGroup Brand
 * @apiDescription Return the list of all the brands.
 * No parameters are required for this endpoint. 
 *
 * @apiSuccess {Brand[]} Object Array of brands
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "name": "nespresso",
 *          "displayName": "Nespresso",
 *          "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Nespresso-logo.svg/320px-Nespresso-logo.svg.png"
 *      },
 *      {
 *          "name": "tagheuer",
 *          "displayName": "Tag Heuer",
 *          "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/TAG_HEUER_logo.svg/500px-TAG_HEUER_logo.svg.png"
 *      },
 *      {...}
 *  ]
 * 
 * @apiUse ServerTimeout
 * 
 */
brand.listBrands = (req, res, next) => {    
    res.status(200).send(res.brands);
};

module.exports = brand;

