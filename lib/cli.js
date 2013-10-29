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

        getOptionCommand: function(option) {
            if (this.optionCommands[option]) {
                return this.optionCommands[option];
            }
        },

        getAliasCommand: function(alias) {
            if (this.aliasCommands[alias]) {
                return this.aliasCommands[alias];
            }
        },

        runOptions: function() {
            this.fetchOptions();

            var deferred = new d.Deferred();
            for(var i in this.optionCommands) {
                var option = this.optionCommands[i];
                if (option.matcher()) {
                    option.run();
                    deferred.resolve();
                }
            }
            if (deferred.state() == 'pending') {
                deferred.reject();
            }
            return deferred.promise();
        },

        runCommands: function() {
            this.fetchCommands();

            var deferred = new d.Deferred(),
                full = optimist.argv._.join(' ');
            for(var i in this.commands) {
                var command = this.commands[i];
                if (full.indexOf(command.name.trim()) === 0) {
                    var args = full.substr(command.name.length).trim().split(' ');
                    command.run.apply(command, args);
                    deferred.resolve();
                }
            }
            if (deferred.state() == 'pending') {
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

            gruntPromise = gruntCommand.run();
            if (gruntPromise) {
                gruntPromise.then(deferred.resolve, deferred.reject);
            } else {
                deferred.reject();
            }
            return deferred.promise();
        },

        fetchOptions: function() {
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

        fetchCommands: function() {
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

            // var a = (new Date()).getTime(), b;

            this.runOptions()
                .then(null, function() {
                    // b = (new Date).getTime();
                    // console.log('x1', (b - a));
                    // a = b;
                    return that.runCommands();
                }).then(null, function() {
                    // b = (new Date).getTime();
                    // console.log('x2', (b - a));
                    // a = b;
                    // console.log('x - start grunt', ((new Date).getTime() - global.DEBUG_START_TIME));
                    return that.runGrunt();
                }).then(null, function() {
                    // b = (new Date).getTime();
                    // console.log('x3', (b - a));
                    // a = b;
                    return that.getAliasCommand('help').run();
                }).then(function() {
                    // b = (new Date).getTime();
                    // console.log('x4', (b - a));
                    // a = b;
                    that.report(0);
                }, function() {
                    // b = (new Date).getTime();
                    // console.log('x5', (b - a));
                    // a = b;
                    that.report(1);
                });

        },

        start: function() {
            var that = this;
            r('app:///package.json', function(err, data) {
                if (!err) {
                    that.version = data.version;
                }

                optimist.usage('PAX.\nUsage: $0');

                that.run();
            });
        }
    };

    module.exports = {
        CLI: CLI
    };
})();
