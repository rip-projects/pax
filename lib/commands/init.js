var d = require('simply-deferred'),
    path = require('path'),
    fs = require('fs'),
    prompt = require('prompt');

module.exports = function(pax, args, opts) {
    var deferred = new d.Deferred(),
        manifest = pax.pkg.manifest;

    if (!manifest) {
        var schema = {
            properties: {
                name: {
                    description: 'Name',
                    required: true,
                    default: path.basename(process.cwd())
                },
                description: {
                    description: 'Description',
                    required: true,
                    default: 'pax package'
                }
            }
        };

        prompt.message = 'pax';
        prompt.colors = false;
        prompt.start();

        prompt.get(schema, function(err, json) {
            if (err) {
                deferred.reject(err);
                return;
            }

            fs.writeFileSync('./package.json', JSON.stringify(json, null, 2));
            pax.pkg.init();
            manifest = pax.pkg.manifest;

            exec('npm install grunt --save-dev');
            exec('npm install grunt-pax-task --save-dev');

            deferred.resolve();
        });

    }
    return deferred.promise();
};