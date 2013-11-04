var d = require('simply-deferred'),
    optimist = require('optimist'),
    resolve = require('resolve').sync,
    matchdep = require('matchdep'),
    pax,
    t1 = process.hrtime(),
    commandOptions = [
        {
            name: 'help',
            alias: 'h',
            run: function() {
                var deferred = d.Deferred();
                var cmd = pax.command.get('help');
                d.when(cmd()).then(deferred.resolve, deferred.reject);
                return deferred.promise();
            }
        }
    ];

var cli = {
    log: require('./logger'),

    commandOptions: commandOptions,

    elapsedTime: function() {
        return process.hrtime(t1);
    },

    delegateToAliasCommand: function(err) {

        var deferred = d.Deferred(),
            found = false,
            match = function(opt) {
                if (opt.match && opt.match(optimist.argv[opt.name])) {
                    return true;
                }
                if (opt.name && optimist.argv[opt.name]) {
                    return true;
                }
                if (opt.alias && optimist.argv[opt.alias]) {
                    return true;
                }
                return false;
            };

        if (err != pax.command.ERR_COMMAND_NOT_FOUND) {
            deferred.reject(err);
        } else if (cli.commandOptions) {
            for(var i in cli.commandOptions) {
                if (match(cli.commandOptions[i])) {
                    d.when(cli.commandOptions[i].run()).then(deferred.resolve, deferred.reject);
                    found = true;
                    break;
                }
            }
            if (!found) {
                deferred.reject(pax.command.ERR_COMMAND_NOT_FOUND);
            }
        } else {
            deferred.reject(pax.command.ERR_COMMAND_NOT_FOUND);
        }
        return deferred.promise();
    },

    delegateToCommand: function() {
        var deferred = d.Deferred();

        var cmd = pax.command.get(optimist.argv._, optimist.argv);
        if (cmd) {
            d.when(cmd()).then(deferred.resolve, deferred.reject);
        } else {
            deferred.reject(pax.command.ERR_COMMAND_NOT_FOUND);
        }

        return deferred.promise();
    },

    delegateToGrunt: function(err) {
        var deferred = new d.Deferred(),
            warnings = [];

        if (err != pax.command.ERR_COMMAND_NOT_FOUND) {
            deferred.reject(err);
        } else if (!pax.pkg.manifest) {
            deferred.reject(new Error('PAX not initialized yet.'));
        } else {
            var grunt = require(resolve('grunt', {basedir: process.cwd()}));

            matchdep.filterDev('grunt-*', process.cwd() + '/package.json').forEach(grunt.loadNpmTasks);

            var config = {};
            if (pax.pkg.manifest.pax && pax.pkg.manifest.pax.grunt) {
                config = pax.pkg.manifest.pax.grunt;
            }

            grunt.initConfig(config);

            grunt.task.options({
                error: function(e) {
                    deferred.reject(e);
                },
                done: function() {
                    deferred.resolve();
                }
            });

            grunt.task.registerMultiTask('build', function() {
                for(var i in this.data) {
                    grunt.task.run(this.data[i]);
                }
            });

            grunt.task.registerMultiTask('clean', function() {
                for(var i in this.data) {
                    rm('-rf', this.data[i]);
                    pax.log.out('  Remove', this.data[i]);
                }
            });

            for(var i in optimist.argv._) {
                grunt.task.run(optimist.argv._[i]);
            }
            grunt.task.start();

        }


        return deferred.promise();
    },

    reportDone: function() {
        var diff = cli.elapsedTime();
        cli.log.out('');
        cli.log.info('Done successfully.');
        cli.log.info('Elapsed time:', diff[0] + '.' + diff[1] + 's.');

    },

    reportFail: function(e) {
        var diff = cli.elapsedTime();
        cli.log.out('');
        cli.log.error(e.message);
        cli.log.info('Done with errors.');
        cli.log.info('Elapsed time:', diff[0] + '.' + diff[1] + 's.');
    },

    run: function(context) {
        pax = context;

        d.when(cli.delegateToCommand())
            .then(null, cli.delegateToAliasCommand)
            .then(null, cli.delegateToGrunt)
            .then(cli.reportDone, cli.reportFail);
    }

};


module.exports = cli;