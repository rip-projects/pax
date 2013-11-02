var fs = require('fs'),
    jsonFile = './package.json',
    pkg = {
        manifest: null,
        init: function() {
            if (fs.existsSync(jsonFile)) {
                pkg.manifest = JSON.parse(fs.readFileSync(jsonFile, {encoding: 'utf8'}));
            } else {
                pkg.manifest = null;
            }
        }
    };

pkg.init();

module.exports = pkg;