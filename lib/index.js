require('colors');
require('shelljs/global');

var optimist = require('optimist'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    os = require('os');

var Pax = function(argv) {
    this.readConfig();

    this.argv = argv || optimist.argv;
};

Pax.prototype = {
    logger: console,

    run: function() {
        var args = this.argv._;

        return this.exec(args, this.logger);

    },

    exec: function(args, logger) {
        var deferred = Q.defer();
        try {
            var action = require('./actions/' + args[0]);


            args = args.splice(1);
            args.push(logger || {log: function() {}, error: function() {}});

            Q.when(action.apply(this, args)).then(deferred.resolve, deferred.reject);
        } catch(e) {
            console.error(e);
            deferred.reject(e);
        }

        return deferred.promise;
    },

    readConfig: function() {
        this.config = {
            server: 'http://192.168.1.99/app/xpax/www/index.php',
            cwd: process.cwd(),
            tmp: path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'pax'),
            directory: 'pax'
        };

        var configFile = path.join(this.getHome(), '.paxrc');
        if (fs.existsSync(configFile)) {
            var config = JSON.parse(fs.readFileSync(configFile)) || {};
            this.config = _.defaults(config, this.config);
        }
    },

    getHome: function () {
      return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    },

    url: function(uri) {
        return this.config.server + uri;
    }
};

module.exports = function(argv) {
    var context = new Pax(argv);

    return context.run();
};