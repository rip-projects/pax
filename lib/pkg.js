var fs = require('fs'),
    _ = require('lodash'),
    jsonFile = './package.json',
    pkg = {
        defaults: {},
        manifest: null,
        init: function() {
            if (fs.existsSync(jsonFile)) {
                pkg.manifest = JSON.parse(fs.readFileSync(jsonFile, {encoding: 'utf8'}));
            } else {
                pkg.manifest = null;
            }
        },
        config: function(key) {
            var tokens = key.split('.');
            var search = _.defaults(pkg.manifest.pax || {}, pkg.defaults);
            for(var i in tokens) {
                search = search[tokens[i]];
                if (!search) {
                    return null;
                }
            }
            return search;
        }
    };

pkg.init();

module.exports = pkg;