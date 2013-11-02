var optimist = require('optimist'),
    helper = require('./helper'),
    path = require('path'),
    r = helper.r,
    m = helper.m,
    d = helper.d;

(function() {
    "use strict";

    var CLI = function() {
        this.version = null;
        this.commands = {};
        this.optionCommands = {};
        this.aliasCommands = {};
    };

    CLI.prototype = {
        DONE_SUCCESS: 'Done: ' + 'success'.green,
        DONE_ERROR: 'Done: ' + 'error'.green,

        tryRunOptionCommand: function() {
            this.prepareOptionCommands();

            var deferred = new d.Deferred(),
                found = false,
                promise;

            for(var i in this.optionCommands) {
                var option = this.optionCommands[i];
                if (option.matcher()) {
                    promise = option.run();
                    if (promise) {
                        promise.then(deferred.resolve, deferred.reject);
                    } else {
                        deferred.resolve();
                    }
                    found = true;
                    break;
                }
            }

            if (!found) {
                deferred.reject();
            }

            return deferred.promise();
        },

        tryRunCommand: function() {
            this.prepareCommands();

            var deferred = new d.Deferred(),
                full = optimist.argv._.join(' '),
                found = false;

            for(var i in this.commands) {
                var command = this.commands[i];
                if (full.indexOf(command.name.trim()) === 0) {
                    var args = full.substr(command.name.length).trim().split(' ');
                    var promise = command.run.apply(command, args);
                    if (promise) {
                        promise.then(deferred.resolve);
                    } else {
                        deferred.resolve();
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                deferred.reject();
            }
            return deferred.promise();
        },

        runGrunt: function() {
            var deferred = new d.Deferred(),
                gruntCommand = require('./grunt-command'),
                gruntPromise;

            gruntCommand.optimist = optimist;
            gruntCommand.cli = this;

            if (this.project) {
                gruntPromise = gruntCommand.run();
                if (gruntPromise) {
                    gruntPromise.then(deferred.resolve, deferred.reject);
                } else {
                    deferred.reject();
                }
            } else {
                deferred.reject();
            }

            return deferred.promise();
        },

        prepareOptionCommands: function() {
            var files = m('app:///lib/option');
            for(var i in files) {
                var file = files[i].trim(),
                    ext = path.extname(file),
                    reqFile = file.substr(0, file.length - ext.length);

                var option = require(reqFile);
                option.optimist = optimist;
                option.cli = this;

                optimist.alias(option.name, option.alias);

                if (option.initialize) option.initialize();

                this.optionCommands[option.name] = this.aliasCommands[option.alias] = option;
            }
        },

        prepareCommands: function() {
            var files = m('app:///lib/command');
            for(var i in files) {
                var file = files[i].trim(),
                    ext = path.extname(file),
                    reqFile = file.substr(0, file.length - ext.length);

                var command = require(reqFile);
                command.optimist = optimist;
                command.cli = this;

                if (command.initialize) command.initialize();

                this.commands[command.name] = command;
            }
        },

        run: function() {
            var that = this;

            this.tryRunOptionCommand().then(null, function() {
                return that.tryRunCommand();
            }).then(null, function() {
                return that.runGrunt();
            }).then(null, function() {
                if (that.aliasCommands['help']) {
                    return that.aliasCommands['help'].run();
                }
            }).then(function() {
                that.report(0);
            }, function() {
                that.report(1);
            });

        },

        start: function() {
            var that = this;
            r('app:///package.json', function(err, data) {
                if (!err) {
                    that.version = data.version;
                }

                var usage = 'PAX'.rainbow.bold + ' version ' + that.version + '\n' +
                    '\n' +
                    'Usage:'.bold + ' pax [options..] [command] [args..]\n' +
                    '\n' +
                    'Command:\n'.bold +
                    '  init'.green + '             Initialize project\n' +
                    '  clean'.green + '            Grunt clean project task\n' +
                    '  dependencies'.green + '     Grunt fetch dependencies task\n' +
                    '  build'.green + '            Grunt build project task\n' +
                    '\n' +
                    'Option:\n'.bold +
                    '  -h, --help'.green + '       See this page';

                optimist.usage(usage);

                r('cwd:///package.json', function(err, data) {
                    if (!err) {
                        that.project = data;
                    }

                    that.run();
                });


            });
        }
    };

    module.exports = {
        CLI: CLI
    };
})();
