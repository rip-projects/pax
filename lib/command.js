var path = require('path'),
    fs = require('fs'),
    pax;

module.exports = {

    commands: {},

    init: function(context) {
        pax = context;
        return this;
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

            if (fs.existsSync(p + '.js')) {
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