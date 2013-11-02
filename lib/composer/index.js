var fs = require('fs');
var composer = {
    init: function() {
        var composerFile = './composer.json';
        if (fs.existsSync(composerFile)) {
            composer.manifest = JSON.parse(fs.readFileSync(composerFile, { encoding: 'utf8' }));
        } else {
            composer.manifest = null;
        }
    }
};

composer.init();

module.exports = composer;