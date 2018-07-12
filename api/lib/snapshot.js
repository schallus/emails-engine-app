const path = require('path');
var phantom = require('phantomjs-prebuilt');

const snapshot = {};

const distPath = path.normalize(__dirname + '../../../emails-engine/dist');

snapshot.capture = function (url, brandName, campaignName, cb) {
    // phantomjs screenshot
    phantom.create((ph) => {
        ph.createPage((page) => {
            page.open(url, (status) => {
                if (status == "success") {
                    // put images in public directory
                    outputFilePath = `${distPath}/${brandName}/${campaignName}/snapshot.png`;
                    page.render(outputFilePath, cb(outputFilePath));
                } else {
                    console.log('404 Not Found');
                }
                page.close();
                ph.exit();
            });
        });
    });
}

module.exports = snapshot;