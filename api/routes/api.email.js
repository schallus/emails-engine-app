// ----- REQUIREMENTS -----
const fs = require('fs');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'wideemailengine@gmail.com',
        pass: '1+password'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// checks if there is no text option specified and populates it based on the html value
transporter.use('compile', htmlToText());

// ----- GLOBAL VARIABLES -----
const email = {};

// ----- ROUTES -----

/**
 * @api {get} /brands/:brandSlug/recipients Get recipients list
 * @apiName getRecipientsList
 * @apiGroup Emails
 * @apiDescription Return the brand's recipients list.
 * No parameters are required for this endpoint. 
 *
 * @apiSuccess {Recipient[]} Object Array of recipients
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "firstname": "John",
 *          "lastname": "Doe",
 *          "email": "john.doe@domain.com"
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 5xx) {500} ErrorReadingRecipients Something unexpected happened while reading the brand recipients file.
 *
 * @apiErrorExample ErrorReadingRecipients:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the brand recipients file."
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
email.getRecipients = (req, res, next) => {
    try {
        recipients = JSON.parse(fs.readFileSync(`${res.brandPath}/recipients.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the brand recipients file."
            });
        } else {
            console.log(err);
            return next();
        }
    }
    res.status(200).json(recipients);
};

/**
 * @api {post} /brands/:brandSlug/recipients Add a recipient
 * @apiName addRecipient
 * @apiGroup Emails
 * @apiDescription Return the recipient created.
 * 
 * @apiParam {Recipient} recipient  Recipient to be created.
 *
 * @apiSuccess {Recipient} Object Recipient created
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "firstname": "John",
 *      "lastname": "Doe",
 *      "email": "john.doe@domain.com"
 *  }
 * 
 * @apiError (Error 4xx) {422} WrongParameter Please send a recipient in the body parameters.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "Please send a recipient in the body parameters."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingRecipients Something unexpected happened while reading the brand recipients file.
 *
 * @apiErrorExample ErrorReadingRecipients:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the brand recipients file."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingRecipients Something unexpected happened while writing the brand recipients file.
 *
 * @apiErrorExample ErrorWritingRecipients:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while writing the brand recipients file."
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
email.addRecipient = (req, res, next) => {
    if(!req.body.firstname || !req.body.lastname || !req.body.email) {
        return next({
            status: 422,
            message: "Please send a recipient in the body parameters."
        });
    }

    const recipient = req.body;

    try {
        recipients = JSON.parse(fs.readFileSync(`${res.brandPath}/recipients.json`, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: "Something unexpected happened while reading the brand recipients file."
            });
        } else {
            console.log(err);
            return next();
        }
    }

    recipients.push(recipient);
    
    const fileData = JSON.stringify(recipient, null, "\t");
    try {
        fs.writeFileSync(`${res.brandPath}/recipients.json`, fileData, 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: `Something unexpected happened while writing the brand recipients file.`
            });
        } else {
            return next();
        }
    }

    res.status(200).json(recipient);
}

/**
 * @api {put} /brands/:brandSlug/recipients Update the recipients list
 * @apiName setRecipients
 * @apiGroup Emails
 * @apiDescription Update the recipients list. Be aware, this function will overide all the recipients previously added to the brand.
 * 
 * @apiParam {Recipient[]} recipients New recipients list
 *
 * @apiSuccess {Recipient} Object New recipients list
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "firstname": "John",
 *          "lastname": "Doe",
 *          "email": "john.doe@domain.com"
 *      },
 *      {...}
 *  ]
 * 
 * @apiError (Error 4xx) {422} WrongParameter Please send a recipient in the body parameters.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "Please send a recipient in the body parameters."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingRecipients Something unexpected happened while reading the brand recipients file.
 *
 * @apiErrorExample ErrorReadingRecipients:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the brand recipients file."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorWritingRecipients Something unexpected happened while writing the brand recipients file.
 *
 * @apiErrorExample ErrorWritingRecipients:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while writing the brand recipients file."
 *       }
 *   }
 * 
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
email.setRecipients = (req, res, next) => {
    if(!Array.isArray(req.body) || !req.body[0].firstname || !req.body[0].lastname || !req.body[0].email) {
        return next({
            status: 422,
            message: "Please send the recipients in the body parameters."
        });
    }

    const recipients = req.body;

    const fileData = JSON.stringify(recipients, null, "\t");
    try {
        fs.writeFileSync(`${res.brandPath}/recipients.json`, fileData, 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return next({
                status: 500,
                message: `Something unexpected happened while writing the brand recipients file.`
            });
        } else {
            return next();
        }
    }

    res.status(200).json(recipients);
}

/**
 * @api {post} /brands/:brandSlug/campaigns/:campaignSlug/send Send a campaign
 * @apiName sendCampaign
 * @apiGroup Emails
 * @apiDescription Build a campaign and send it by email to the selected recipients in the given languages.
 * 
 * @apiParam {string[]} recipients Array of recipients email addresses
 *
 * @apiSuccess {HttpRequestSuccess} Success Success 200
 * 
 * @apiSuccessExample {text} Success-Response:
 *  HTTP/1.1 200 OK
 * 
 * @apiError (Error 4xx) {422} WrongParameter Please send the recipients in the body parameters.
 *
 * @apiErrorExample WrongParameter:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "Please send the recipients in the body parameters."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingConfig Something unexpected happened while reading the campaign configuration file.
 *
 * @apiErrorExample ErrorReadingConfig:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the campaign configuration file."
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {422} InvalidLanguages Some of the languages given in the body parameters are invalid.
 *
 * @apiErrorExample InvalidLanguages:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "Some of the languages given in the body parameters are invalid."
 *       }
 *   }
 * 
 * @apiError (Error 4xx) {422} InvalidEmails The email addresses provided are invalid.
 *
 * @apiErrorExample InvalidEmails:
 *  HTTP/1.1 422 Unprocessable Entity
 *   {
 *       "error": {
 *           "status": 422,
 *           "message": "The email addresses provided are invalid."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorReadingHtmlFile Something unexpected happened while reading the email html file.
 *
 * @apiErrorExample ErrorReadingHtmlFile:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while reading the email html file."
 *       }
 *   }
 * 
 * @apiError (Error 5xx) {500} ErrorSendingEmails Something unexpected happened while sending the test emails. Please try again later.
 *
 * @apiErrorExample ErrorSendingEmails:
 *  HTTP/1.1 500 Internal Server Error
 *   {
 *       "error": {
 *           "status": 500,
 *           "message": "Something unexpected happened while sending the test emails. Please try again later."
 *       }
 *   }
 * 
 * @apiUse buildCampaign
 * @apiUse compileJSON
 * @apiUse ServerTimeout
 * @apiUse BrandNotFound
 * 
 */
email.sendTest = (req, res, next) => {
    const brandSlug = req.params.brandSlug;
    const campaignSlug = req.params.campaignSlug;
    let recipients = req.body.recipients;

    if (!recipients || recipients.length < 1 || !brandSlug || !campaignSlug) {
        return next({
            status: 422,
            message: `Please send the recipients in the body parameters.`
        });
    }

    try {
        campaignConfig = JSON.parse(fs.readFileSync(`${res.brandPath}/${campaignSlug}/config.json`, 'utf8'));
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

    const campaignLanguages = Object.keys(campaignConfig.lang);

    let languages = [];

    if (req.body.languages) {
        if (req.body.languages.every(elem => campaignLanguages.indexOf(elem) > -1)) {
            languages = req.body.languages;
        } else {
            return next({
                status: 422,
                message: "Some of the languages given in the body parameters are invalid."
            });
        }
    } else {
        languages = campaignLanguages;
    }

    // Delete all the email addresses that are invalid.
    recipients = recipients.filter(email => validateEmail(email));

    if (recipients.length < 1) {
        return next({
            status: 422,
            message: `The email addresses provided are invalid.`
        });
    }

    for (let lang of languages) {
        // get the email html data
        const filePath = req.previewLinks.filter(el => el.lang === lang)[0].path;
        try {
            emailHtmlData = fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                return next({
                    status: 500,
                    message: "Something unexpected happened while reading the email html file."
                });
            } else {
                console.log(err);
                return next();
            }
        }

        // setup email data with unicode symbols
        const mailOptions = {
            from: '"WIDE Email Engine" <no-reply@wideagency.com>', // sender address
            bcc: recipients.toString(), // list of receivers
            subject: campaignConfig.lang[lang].subject, // Subject line
            html: emailHtmlData // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return next({
                    status: 500,
                    message: 'Something unexpected happened while sending the test emails. Please try again later.'
                })
            }
            console.log('Email sent: %s', info.messageId);
            res.status(200).send();
        });
    }
};

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = email;
