var composer = require('../../composer'),
    prompt = require('prompt'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    url = require('url'),
    d = require('simply-deferred');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred();

    var checkArgs = function() {
        var deferred = d.Deferred();
        if (args.length > 0) {
            deferred.resolve();
        } else {
            deferred.reject(new Error('No package to add'));
        }
        return deferred.promise();
    };

    var checkComposer = function() {
        var deferred = d.Deferred();

        if (!composer.manifest) {
            var schema = {
                properties: {
                    name: {
                        name: 'Name',
                        default: process.env['USER'] + '/' + pax.pkg.manifest.name,
                        required: true
                    },
                    description: {
                        name: 'Description',
                        default: pax.pkg.manifest.description,
                        required: true
                    },
                    version: {
                        name: 'Version',
                        default: pax.pkg.manifest.version,
                        required: true
                    }
                }
            };

            prompt.message = 'composer';
            prompt.colors = false;
            prompt.start();
            prompt.get(schema, function(err, json) {
                if (!err) {
                    json.autoload = {
                        "psr-0": {
                            "App": "src/"
                        }
                    };

                    fs.writeFileSync('./composer.json', JSON.stringify(json, null, 2));
                    composer.init();

                    deferred.resolve();
                } else {
                    deferred.reject(err);
                }
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise();
    };

    var add = function() {

        var deferred = d.Deferred();

        var arg0 = args[0];
        var parsedURL = url.parse(arg0),
            pkg, name, version, repository;

        if (parsedURL.protocol) {
            //vcs
            if (parsedURL.protocol == 'git+ssh:') {
                repository = arg0.substr(10);
            } else {
                repository = arg0;
            }

            name = parsedURL.path.trim();
            if (name.match(/\/\.git$/)) {
                name = name.substr(0, name.length - 5);
            } else if (name.match(/\.git$/)) {
                name = name.substr(0, name.length - 4);
            }
            name = name.split(/[\/:]+/);
            name = name.splice(-2).join('/');

            // FIXME it shouldnt be always dev-master
            version = version || 'dev-master';
        } else {
            pkg = arg0.split('@');
            name = cleanse(pkg[0]);
            version = cleanse(pkg[1]);
        }

        if (name && version) {
            if (composer.manifest.require[name]) {
                deferred.reject(new Error('Package "' + name + '" conflict or already exist.'));
            } else {
                composer.manifest.require = composer.manifest.require || {};
                composer.manifest.require[name] = version;

                pax.log.out('Adding composer package ' + name + '@' + version + '...');
                if (repository) {
                    pax.log.out('From ' + repository + '...');

                    composer.manifest.repositories = composer.manifest.repositories || [];
                    composer.manifest.repositories.push({
                        type: 'vcs',
                        url: repository
                    });
                }

                fs.writeFileSync('./composer.json', JSON.stringify(composer.manifest, null, 2));
                composer.init();

                var c = spawn('composer', ['update'], {stdio:'inherit'});
                c.on('close', function(code) {
                    deferred.resolve();
                });
            }

        } else {
            deferred.reject(new Error('Parsing error.'));
        }

        return deferred.promise();
    };

    d.when(checkArgs())
        .then(checkComposer)
        .then(add)
        .then(deferred.resolve, deferred.reject);

    return deferred.promise();
};