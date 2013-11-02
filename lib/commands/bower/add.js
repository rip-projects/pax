var d = require('simply-deferred'),
    fs = require('fs'),
    url = require('url'),
    bower = require('bower'),
    prompt = require('prompt');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred(),
        bowerFile = './bower.json';

    var checkArgs = function() {
        var deferred = d.Deferred();
        if (args.length > 0) {
            var newArgs = [];
            for(var i in args) {
                var parsed = url.parse(args[i]);
                if (parsed.protocol) {
                    if (parsed.protocol == 'git+ssh:') {
                        newArgs.push(args[i].substr('git+ssh://'.length));
                        continue;
                    }
                }
                newArgs.push(args[i]);
            }

            args = newArgs;

            deferred.resolve();
        } else {
            deferred.reject(new Error('No package to add'));
        }
        return deferred.promise();
    };

    var checkBower = function() {
        var deferred = d.Deferred();

        if (!fs.existsSync(bowerFile)) {
            bower.commands.init({interactive: true})
                .on('log', function(result) {
                    // console.log('log', result);
                })
                .on('prompt', function(p, callback) {
                    if (p[0].name == 'prompt') {
                        return callback({prompt: true});
                    }

                    var schema = {
                        properties: {
                            name: {
                                name: 'Name',
                                default: pax.pkg.manifest.name,
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
                    prompt.message = 'bower';
                    prompt.colors = false;
                    prompt.start();
                    prompt.get(schema, function(err, json) {
                        if (!err) {
                            json.keywords = '';
                            json.authors = '';
                            callback(json);
                        }
                    });
                })
                .on('error', function() {
                    console.log('error', arguments);
                })
                .on('end', function() {
                    deferred.resolve();
                    // console.log('end', arguments);
                });
        } else {
            deferred.resolve();
        }

        return deferred.promise();
    };


    var add = function() {
        var deferred = d.Deferred();

        bower.commands.install(args, {save:true})
            .on('log', function(result) {
                pax.log.out(result.id, result.message);
                // console.log('log', result);
            })
            .on('error', function() {
                console.log('fail', arguments);
            })
            .on('end', function() {
                // console.log('end', arguments);
                deferred.resolve();
            });
        return deferred.promise();
    };

    d.when(checkArgs())
        .then(checkBower)
        .then(add)
        .then(deferred.resolve, deferred.reject);

    return deferred.promise();
};