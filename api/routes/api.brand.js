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
 *
 * @apiSuccess {Object} brand Brand object
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

brand.addBrand = (req, res, next) => {
    req.checkBody("name", "Enter a valid name.").isAlphanumeric().isLength({min:3, max: undefined});
    req.checkBody("displayName", "Enter a valid displayName.").isLength({min:3, max: undefined});
    req.checkBody("logoUrl", "Enter a valid logoUrl.").optional().isURL();

    if (req.validationErrors()) return next();

    const brands = res.brands;

    // Check if this brand already exists
    if(brands.filter(brand => (brand.name === req.body.name)).length) {
        return next({
            status: 409,
            message: `A brand with the name '${req.body.name}' already exists.`
        });
    }

    // no error -> normal processing here

    const newBrand = {
        name: req.body.name,
        displayName: req.body.displayName,
        logoUrl: req.body.logoUrl
    };

    brands.push(newBrand);

    const fileData = JSON.stringify(brands, null, "\t");
    try {
        fs.writeFileSync(brandsListPath, fileData, 'utf8');
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

    res.status(200).json(newBrand);
};

module.exports = brand;

