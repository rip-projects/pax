var Q = require('q'),
    cmd = require('../utils/cmd'),
    tmp = require('tmp'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    copy = require('../utils/copy'),
    rimraf = require('rimraf');

tmp.setGracefulCleanup();

var GitResolver = function(pkg, logger, context) {
    this.pkg = pkg;
    this.logger = logger;
    this.context = context;
};

GitResolver.prototype = {
    fetch: function() {
        var tmpDir = this.context.config.tmp,
            that = this;

        return Q.nfcall(mkdirp, tmpDir)
            .then(function () {
                return Q.nfcall(tmp.dir, {
                    template: path.join(tmpDir, process.pid + '-XXXXXX'),
                    mode: 0777 & ~process.umask(),
                    unsafeCleanup: true
                });
            })
            .then(function (dir) {
                tmpDir = dir;
                return cmd('git', ['clone', that.pkg.repository, dir]);
            }).then(function() {
                return Q.nfcall(rimraf, path.join(tmpDir, '.git'));
            }).then(function() {
                return tmpDir;
            });
    },

    init: function(tmpDir) {
        var cwd = this.context.config.cwd;

        return Q.nfcall(mkdirp, cwd).then(function() {
            return copy.copyDir(tmpDir, cwd);
        });
    }
};

module.exports = GitResolver;