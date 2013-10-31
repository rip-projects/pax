/**
 * pax
 * https://github.com/reekoheek/pax
 *
 * Copyright (c) 2013 PT Sagara Xinix Solusitama
 * Licensed under the MIT license.
 * https://github.com/reekoheek/pax/blob/master/LICENSE
 *
 * Composer command
 *
 */

var helper = require('../helper'),
    prompt = require('prompt'),
    url = require('url'),
    e = helper.e,
    d = helper.d,
    w = helper.w,
    r = helper.r;

var composerJsonFile = 'cwd:///composer.json',
    manifest;

var cleanse = function(str) {
    str = str.trim();
    if (str[0] == '"' || str[0] == "'") {
        str = str.substr(1, str.length - 2);
    }
    return str;
};

var getManifest = function(autoCreate) {

    // prepare autoCreate, autoCreate default to true if parameter doesnt exist
    if (typeof autoCreate == 'undefined') {
        autoCreate = true;
    }

    var deferred = new d.Deferred();

    r(composerJsonFile, function(err, data) {
        if (err) {
            console.log('Composer is ' + 'not enabled'.bold.red + ' yet!');

            if (!autoCreate) {
                deferred.reject(new Error('Composer not found'));
                return;
            }

            console.log('Luckily we will enable composerModule for you :)\n');

            var schema = {
                properties: {
                    name: {
                        description: 'Name',
                        default: process.env['USER'] + '/' + composerModule.cli.project.name,
                        required: true
                    },
                    description: {
                        description: 'Description',
                        required: true,
                        default: composerModule.cli.project.description
                    }
                }
            };

            prompt.message = "composer";
            // prompt.colors = false;

            prompt.start();
            prompt.get(schema, function(err, result) {
                var json = result;

                if (err) {
                    console.log('');
                    deferred.reject();
                } else {
                    exec('composer init --name="' + json.name + '" --description="' + json.description + '"');

                    console.log('');
                    console.log('Composer is ' + 'enabled'.bold.green + ' now. You may proceed what you want to do.');
                    r(composerJsonFile, function(err, data) {
                        manifest = data;
                        deferred.resolve(manifest);
                    });

                }

            });
        } else {
            manifest = data;
            deferred.resolve(manifest);
        }
    });
    return deferred.promise();
};

var composerModule = module.exports = {
    name: 'composer',
    description: 'Enable composer to project.',

    search: function(sub, arg0) {
        exec('composer search ' + arg0);
        return new d.Deferred().resolve().promise();
    },

    add: function(sub, arg0) {
        var deferred = new d.Deferred();

        getManifest().then(function(manifest) {

            arg0 = arg0.trim() || '';

            var parsedURL = url.parse(arg0),
                pkg, name, version, repository;

            // console.log(parsedURL);
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
                manifest.require[name] = version;

                if (repository) {
                    console.log('Adding composer package ' + name + '@' + version + ' from ' + repository + '...');

                    manifest.repositories = manifest.repositories || [];
                    manifest.repositories.push({
                        type: 'vcs',
                        url: repository
                    });
                } else {
                    console.log('Adding composer package ' + name + '@' + version + '...');
                }

                manifest.autoload = {
                    "psr-0": {
                        "App": "src/"
                    }
                };

                // console.log(manifest);
                w(composerJsonFile, manifest, function(err) {
                    if (err) {
                        deferred.reject();
                        // something bad happened
                    } else {
                        // yay
                        exec('composer update');
                        deferred.resolve();
                    }
                });
            }

        });
        return deferred.promise();
    },

    list: function(sub, arg0) {
        var deferred = new d.Deferred();

        getManifest(false).done(function(manifest) {
            var i;
            console.log('Require:');
            for(i in manifest.require) {
                console.log(i + '@' + manifest.require[i]);
            }
        });

        return deferred.promise();
    },

    run: function(sub, arg0) {
        var deferred = new d.Deferred();

        sub = sub || 'list';

        if (typeof composerModule[sub] == 'function' && sub != 'run') {
            composerModule[sub].apply(composerModule, arguments).then(deferred.resolve, deferred.reject);
        } else {
            console.log('Command: "composer ' + sub + '" is not available.');
            deferred.reject();
        }

        return deferred.promise();
    }
};