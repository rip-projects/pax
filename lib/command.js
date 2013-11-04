var path = require('path'),
    fs = require('fs'),
    d = require('simply-deferred'),
    pax;

var command = {
    ERR_COMMAND_NOT_FOUND: new Error('Command not found.'),
    commands: {},

    init: function(context) {
        pax = context;
        return this;
    },

    run: function(cmdArgs, opts) {
        var cmd = command.get(cmdArgs, opts);
        if (cmd) {
            return cmd();
        } else {
            return d.Deferred().reject(command.ERR_COMMAND_NOT_FOUND).promise();
        }
    },

    get: function(cmdArgs, opts) {
        var p = path.join(__dirname, 'commands'),
            pkgPath, args;

        if (typeof(cmdArgs) == 'string') {
            cmdArgs = cmdArgs.split(/\s+/);
        }

        if (cmdArgs.length <= 0) {
            return;
        }


        for(var i = 0; i < cmdArgs.length; i++) {
            p = path.join(p, cmdArgs[i]);

            var jsExists = fs.existsSync(p + '.js'),
                indexExists = fs.existsSync(p + '/index.js');

            if (jsExists || indexExists) {
                pkgPath = p;
                args = [];
                for(var j = i + 1; j < cmdArgs.length; j++) {
                    args.push(cmdArgs[j]);
                }
            }
        }

        if (pkgPath) {
            var cmd = require(pkgPath);
            return function() {
                return cmd(pax, args, opts);
            };
        }
    }
};

module.exports = command;