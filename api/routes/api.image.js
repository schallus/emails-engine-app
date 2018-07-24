// ----- REQUIREMENTS -----
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const textUtils = require('../lib/text');
const mkdirp = require('mkdirp');

// ----- GLOBAL VARIABLES -----
const distPath = path.normalize(__dirname + '../../../emails-engine/dist');
const clientsPath = path.normalize(__dirname + '../../../emails-engine/src/clients');
const tempPath = path.normalize(__dirname + '../../temp');
const image = {};

// ----- UPLOAD CONFIGURATION -----
// Use a temp folder to store the images temporarily
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, tempPath)
    },
    filename: function (req, file, cb) {
        cb(null, textUtils.formatFilename(file.originalname))
    }
});

// Accept only images
const multerOptions = {
    fileFilter: (req, file, cb) => {
        const type = file.mimetype;
        const typeArray = type.split("/");
        if (typeArray[0] == "image") {
            // this is an image
            cb(null, true);
        } else {
            // this is not an image
            return cb(null, false);
        }
    },
    storage: storage
};

const upload = multer(multerOptions);
const uploadImage = upload.single('image');

// ----- ROUTES -----

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/images Upload an image
 * @apiName uploadImage
 * @apiGroup Images
 * @apiDescription Upload an image and return its public link.
 * 
 * @apiParam {File} image Image to upload to the server.
 *
 * @apiSuccess {Object} Object Public link to the uploaded image
 *  
 * @apiSuccessExample {text} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      imageUrl: '/dist/brand/campaign/images/uploads/imageName.jpg'
 *  }
 * 
 * @apiError (Error 5xx) {500} ErrorUpload An error occured when uploading the file.
 *
 * @apiErrorExample ErrorUpload:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "An error occured when uploading the file."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} FormatInvalid Image format invalid or nothing was sent.
 *
 * @apiErrorExample FormatInvalid:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Image format invalid or nothing was sent."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} MkDirError Could not create the image folder.
 *
 * @apiErrorExample MkDirError:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Could not create the image folder."
 *       }
 *   }
 * 
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
image.addImage = (req, res, next) => {

    const brandSlug = req.params.brandSlug;
    const campaignSlug = req.params.campaignSlug;

    uploadImage(req, res, (err) => {
        if (err) {
            console.log(err);
            // An error occurred when uploading
            return next({
                status: 500,
                message: `An error occured when uploading the file.`
            });
        }

        // Everything went fine
        const image = req.file;

        if(!image) {
            return next({
                status: 500,
                message: `Image format invalid or nothing was sent.`
            });
        }

        const clientImagePath = `${clientsPath}/${brandSlug}/${campaignSlug}/images/uploads`;
        const distImagePath = `${distPath}/${brandSlug}/${campaignSlug}/images/uploads`;

        // Create dir if doesn't exist
        if (!fs.existsSync(clientImagePath)){
            mkdirp(clientImagePath, (err) => {
                if (err) return next({
                    status: 500,
                    message: `Could not create the image folder.`
                });
            });
        }
        if (!fs.existsSync(distImagePath)){
            mkdirp(distImagePath, (err) => {
                if (err) return next({
                    status: 500,
                    message: `Could not create the image folder.`
                });
            });
        }

        // Move the file uploaded from temp to dist folder
        fs.rename(`${tempPath}/${req.file.filename}`, `${clientImagePath}/${req.file.filename}`, (err) => {
            if (err) {
                return next({
                    status: 500,
                    message: `An error occured when uploading the file.`
                });
            }

            // Copy file to dist folder to serve
            fs.createReadStream(`${clientImagePath}/${req.file.filename}`)
                .pipe(fs.createWriteStream(`${distImagePath}/${req.file.filename}`));

            res.status(200).json({
                imageUrl: `images/uploads/${req.file.filename}`
            });
        });
    });    
};


/**
 * @api {delete} /brands/:brandSlug/campaigns/:campaignSlug/images Delete an image
 * @apiName deleteImage
 * @apiGroup Images
 * @apiDescription Delete an image by file name.
 * 
 * @apiParam {string} imageFileName Image file name to be deleted from the campaign.
 *
 * @apiSuccess {HttpRequestSuccess} Success Success 200
 * 
 * @apiError (Error 4xx) {422} WrongParameters Please send the image url to be removed in the body parameters.
 *
 * @apiErrorExample WrongParameters:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "Please send the image url to be removed in the body parameters."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorRemovingFile Couldn't remove the image. Either the image name, the brand name or the campaign name is incorrect.
 *
 * @apiErrorExample ErrorRemovingFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Couldn't remove the image. Either the image name, the brand name or the campaign name is incorrect."
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
image.removeImage = (req, res, next) => {

    const brandSlug = req.params.brandSlug;
    const campaignSlug = req.params.campaignSlug;
    const imageFileName = req.body.imageFileName;

    if(!imageFileName || !brandSlug || !campaignSlug) {
        return next({
            status: 422,
            message: `Please send the image url to be removed in the body parameters.`
        });
    }

    const imagesToRemove = [
        `${distPath}/${brandSlug}/${campaignSlug}/images/uploads`,
        `${clientsPath}/${brandSlug}/${campaignSlug}/images/uploads`
    ];

    for (let imagePath of imagesToRemove) {
        fs.unlink(path.join(imagePath, imageFileName), err => {
            if (err) return next({
                status: 404,
                message: 'Couldn\'t remove the image. Either the image name, the brand name or the campaign name is incorrect.'
            });
        });
    }
    res.sendStatus(200);
};

module.exports = image;
