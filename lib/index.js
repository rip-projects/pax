require('colors');
require('shelljs/global');

var optimist = require('optimist'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Q = require('q'),
    os = require('os'),
    cmd = require('./utils/cmd');

var Pax = function(argv) {
    this.initConfig();

    this.argv = argv || optimist.argv;

    this.tasks = {};

    try {
        this.url('/');
    } catch(e) {
        this.logger.error((e + '').red);
        process.exit(1);
    }
};

Pax.prototype = {
    logger: console,
    version: '1.0.0',

    run: function() {
        "use strict";
        var that = this,
            args = this.argv._;

        Q.when(this.initTask()).then(function() {
            return that.exec(args, that.logger);
        }).then(function() {
            that.logger.log('\n.'.green);
        }, function(e) {
            that.logger.error((e + '').red);
            process.exit(1);
        });

    },

    task: function(name, description, callback) {
        "use strict";
        if (typeof description === 'function') {
            callback = description;
            description = '';
        }

        callback.description = description;
        this.tasks[name] = callback;
    },

    exec: function(args, logger) {
        "use strict";
        var deferred = Q.defer(),
            taskName = args[0];

        args = args.slice(1);
        args.push(logger || {log: function() {}, error: function() {}});

        if (this.tasks[taskName]) {
            var task = this.tasks[taskName];
            Q.when(task.apply(this, args)).then(deferred.resolve, deferred.reject);
        } else {
            var action,
                p = './actions/' + taskName;

            try {
                if (fs.existsSync(path.join(__dirname, p + '.js')) || fs.existsSync(path.join(__dirname, p + '.node'))) {
                    action = require(p);
                    Q.when(action.apply(this, args)).then(deferred.resolve, deferred.reject);
                } else {
                    var newArgs = args.slice(1),
                        subTaskName = args[0];

                    if (typeof subTaskName !== 'string') {
                        subTaskName = 'index';
                    }

                    module.paths.push(path.join(this.config.cwd, 'node_modules'));
                    action = require('pax-' + taskName + '/lib/actions/' + subTaskName);
                    Q.when(action.apply(this, newArgs)).then(deferred.resolve, deferred.reject);
                }
            } catch(ex) {
                if (ex.code === 'MODULE_NOT_FOUND') {
                    throw new Error('Cannot find module for "' + taskName + '"');
                } else {
                    throw ex;
                    // deferred.reject(e);
                }
            }
        }

        return deferred.promise;
    },

    require: function(name) {
        "use strict";
        return require(name);
    },

    initTask: function() {
        "use strict";
        var paxFile = path.join(this.config.cwd, 'paxfile.js'),
            deferred = Q.defer(),
            that = this;

        var doNext = function(stream) {
            if (stream) {
                console.log(stream[0]);
            }
            var actionFactory = require(paxFile);
            if (typeof actionFactory === 'function') actionFactory.apply(that);

            deferred.resolve();
        };

        if (fs.existsSync(paxFile)) {
            if (!fs.existsSync(path.join(this.config.cwd, 'node_modules')) && fs.existsSync(path.join(this.config.cwd, 'package.json'))) {
                that.logger.log('Initiating node_modules for the first time...'.yellow);
                cmd('npm', ['install']).then(doNext);
            } else {
                doNext();
            }
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    },

    initConfig: function() {
        "use strict";
        this.config = {
            server: '',
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
        "use strict";
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    },

    url: function(uri) {
        "use strict";
        if (!this.config.server) {
            throw new Error('PAX repository server should be defined at ~/.paxrc');
        }
        return this.config.server + uri;
    },

    internalRun: function() {
        var deferred = Q.defer(),
            that = this;

        if (!this.argv._.length) {
            Q.when(this.exec(['help'], that.logger)).then(function() {
                that.logger.log('.');
                deferred.resolve();
            }, function(e) {
                that.logger.error((e + '').red);
            });
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }
};

module.exports = function(argv) {
    "use strict";
    var context = new Pax(argv);

    return context.internalRun().fail(function() {
        return context.run();
    });
};