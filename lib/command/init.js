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

        var that = this;

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
                            that.install();
                        } else {
                            console.error('Error writing package.json');
                        }
                    });
                });

            } else {
                that.install();
            }
        });
    },
    install: function() {
        e('npm install grunt --save-dev');
        e('npm install shelljs --save-dev');
        e('npm install grunt-pax-task --save-dev');
        e('npm install grunt-contrib-clean --save-dev');

        var installBower = function() {
            var deferred = new d.Deferred();
            r('cwd:///bower.json', function(err, data) {
                if (!err) {
                    e('npm install grunt-bower-task --save-dev');
                }
                deferred.resolve();
            });
            return deferred.promise();
        };

        installBower().then(function() {
            console.log('done');
        });
    }
};