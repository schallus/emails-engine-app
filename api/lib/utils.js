'use strict';

// ----- DEPENDENCIES
const path = require('path'); 
const fs = require('fs');
//const util = require('util');
//const moment = require('moment');

// ----- PRIVATE METHODS -----

const isDirectory = (source) => fs.lstatSync(source).isDirectory();

// ----- UTILS -----
const utils = {}

utils.getDirectories = (source) => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

utils.fromDir = (startPath, filter, callback) => {
    let filteredFiles = new Array();

    console.log('startPath', startPath);
    
    if (!fs.existsSync(startPath)){
        console.log("no dir ", startPath);
        return;
    }

    const files=fs.readdirSync(startPath);
    for (let i=0; i<files.length; i++) {
        const filename = path.join(startPath, files[i]);
        if (filter.test(filename)) filteredFiles.push(filename);
    };

    callback(filteredFiles);
};

utils.entries = function* (obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

utils.flatten = (arr) => {
    return arr.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? utils.flatten(toFlatten) : toFlatten);
    }, []);
}

// Log to file
/*utils.logFileStream = fs.createWriteStream(path.normalize(__dirname + '/../logs/debug.log', {flags : 'a'}));
utils.logConsoleStream = process.stdout;

utils.log = (message) => {
    utils.logFileStream.write(moment().format() + util.format(message) + '\n');
    utils.logConsoleStream.write(moment().format() + util.format(message) + '\n');
}*/

module.exports = utils;