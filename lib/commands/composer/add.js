var composer = require('../../composer'),
    prompt = require('prompt'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    d = require('simply-deferred');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred();

    var add = function() {
        composer.manifest.require = composer.manifest.require || {};
        composer.manifest.require.push()
        // var composer = spawn('composer', ['update'], {stdio:'inherit'});
        // composer.on('close', function(code) {
        //     deferred.resolve();
        // });
    };

    if (!composer.manifest) {
        var schema = {
            properties: {
                name: {
                    name: 'Name',
                    default: process.env['USER'] + '/' + pax.pkg.manifest.name
                },
                description: {
                    name: 'Description',
                    default: pax.pkg.manifest.description
                }
            }
        };

        prompt.colors = false;
        prompt.start();
        prompt.get(schema, function(err, json) {
            if (!err) {
                fs.writeFileSync('./composer.json', JSON.stringify(json, null, 2));
                composer.manifest = json;
                add();
            } else {
                deferred.reject(err);
            }
        });
    } else {
        add();
    }

    return deferred.promise();
};