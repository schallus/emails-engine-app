'use strict';

// ----- LOAD ENV VARIABLES -----

require('dotenv').config();

// ----- REQUIREMENTS -----

// vendor
const express = require('express');
const helmet = require('helmet');   // Helps you secure your Express apps
                                    // by setting various HTTP headers
const cors = require('cors');       // Enable All CORS Requests

const exphbs  = require('express-handlebars');  // templating engine
const path = require('path');

// custom
const apiRouter = require('./routes/api');

const app = express();

// ----- EXPRESS CONFIGURATION -----
const hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    helpers: {
        ifIn: function(elem, list, options) {
            if(list.indexOf(elem) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        ifDisplayLang: function(lang, blocksData, blockName, options) {
            const blockData = blocksData.filter(block => block.blockName === blockName)[0];
            if(blockData) {
                const display = (blockData.languages.filter(el => el.lang === lang)[0]) ? blockData.languages.filter(el => el.lang === lang)[0].display : false;
                return (display) ? options.fn(this) : options.inverse(this);
            }
            return options.fn(this);
        },
        ifObject: function(item, options) {
            if(typeof item === "object") {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        toJSON: function(obj) {
            return JSON.stringify(obj);
        },
        masterValue: function(blockName, masterLang, propertyName, parentPropertyName, index, options) {
            let dataLang = options.data.dataLang;
            if (typeof parentPropertyName == 'string') {
                return dataLang
                    .filter(el => el.blockName == blockName)[0].languages
                    .filter(el => el.lang == masterLang)[0].properties
                    .filter(el => el.name == parentPropertyName)[0].value[index]
                    .filter(el => el.name === propertyName)[0].value;
            } else {
                return dataLang
                    .filter(el => el.blockName == blockName)[0].languages
                    .filter(el => el.lang == masterLang)[0].properties
                    .filter(el => el.name == propertyName)[0].value;
            }      
        },
        escape: function(variable) {
            if (variable) {
                return variable.replace(/([\\"])/g, '\\$1');
            }
            return null;
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// ----- MIDDLEWARES -----

app.use('/docs', express.static('docs')); // API DOC
app.use(express.static(__dirname + '../../angular'));
app.use('/dist', express.static(__dirname + '../../emails-engine/dist'));
app.use('/public', express.static(__dirname + '../../emails-engine/public'));
app.use(cors());
app.use(helmet());

// ----- ROUTES -----

app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/../angular/index.html'));
});

// ----- ENTRY POINT -----
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Application listening on port ${PORT}`);