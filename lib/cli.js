var d = require('simply-deferred'),
    optimist = require('optimist'),
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

    reportDone: function() {
        var diff = cli.elapsedTime();
        cli.log.info('Done successfully');
        cli.log.info('Elapsed time:', diff[0] + '.' + diff[1]);

    },

    reportFail: function(e) {
        var diff = cli.elapsedTime();
        cli.log.error(e.message);
        cli.log.info('Done with errors');
        cli.log.info('Elapsed time:', diff[0] + '.' + diff[1]);
    },

    run: function(context) {
        pax = context;

        d.when(cli.delegateToCommand())
            .then(null, cli.delegateToAliasCommand)
            .then(cli.reportDone, cli.reportFail);
    }

};


module.exports = cli;