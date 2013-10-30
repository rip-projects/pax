var helper = require('../helper'),
    r = helper.r,
    p = helper.p,
    w = helper.w,
    e = helper.e,
    d = helper.d;

var prompt = require('prompt');

module.exports = {
    name: 'init',
    description: 'Create basic project configuration.',
    run: function() {

        var that = this,
            deferred = new d.Deferred();

        r('cwd:///package.json', function(err, data) {
            data = data || {
                name: require('path').basename(process.cwd()),
                description: 'pax project',
            };

            if (err) {

                var propName = {
                    pattern: /^[a-zA-Z\s\-]+$/,
                    description: 'Name',
                    message: 'Name must be only letters, spaces, or dashes',
                    required: true
                };

                if (data.name) {
                    propName.default = data.name;
                }

                var propDesciption = {
                    description: 'Description',
                    required: true
                };

                if (data.description) {
                    propDesciption.default = data.description;
                }

                var schema = {
                    properties: {
                        name: propName,
                        description: propDesciption
                    }
                };

                prompt.message = "pax";
                prompt.colors = false;

                prompt.start();
                prompt.get(schema, function(err, result) {
                    var json = result;

                    w('cwd:///package.json', json, function(err) {
                        if (!err) {
                            that.install().then(deferred.resolve);
                        } else {
                            console.error('Error writing package.json');
                            deferred.reject();
                        }
                    });
                });

            } else {
                that.install().then(deferred.resolve);
            }
        });
        return deferred.promise();
    },
    install: function() {
        var installBower = function() {
                var deferred = new d.Deferred();
                r('cwd:///bower.json', function(err, data) {
                    if (!err) {
                        e('npm install grunt-bower-task --save-dev');
                    }
                    deferred.resolve();
                });
                return deferred.promise();
            },
            options = {
                offset: 0,
                out: function(data) {
                    console.log('\n\n' + data);
                    options.offset = 0;
                },
                err: function(data) {
                    process.stdout.write('.'.yellow);
                    if (options.offset++ > 40) {
                        options.offset = 0;
                        process.stdout.write('\n');
                    }
                    // data = data.trim();
                    // if (data !== 'npm') {
                    //     console.log('err> '.bold.red + data);
                    // }
                }
            },
            deferred = new d.Deferred();

        console.log('Installing grunt...');
        e('npm install grunt --save-dev', options).then(function() {

            console.log('Installing shelljs...');
            return e('npm install shelljs --save-dev', options);
        }).then(function() {

            console.log('Installing lodash...');
            return e('npm install lodash --save-dev', options);
        }).then(function() {

            console.log('Installing grunt-pax-task...');
            return e('npm install grunt-pax-task --save-dev', options);
        }).then(function() {

            console.log('Installing grunt-contrib-clean...');
            return e('npm install grunt-contrib-clean --save-dev', options);
        }).then(installBower).then(function() {
            deferred.resolve();
        }, function() {
            deferred.reject();
        });

        return deferred.promise();
    }
};