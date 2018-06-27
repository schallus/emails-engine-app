const fs = require('fs');
const mv = require('mv');

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const moveFolder = (source, destination, callback) => {
    mv(source, destination, {mkdirp: true}, callback);
}

const file = {
    deleteFolderRecursive: deleteFolderRecursive,
    moveFolder: moveFolder
};

module.exports = file;
