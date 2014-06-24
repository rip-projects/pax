var Q = require('q'),
    request = require('request'),
    fs = require('fs'),
    mout = require('mout'),
    extract = require('../utils/extract'),
    // cmd = require('../utils/cmd'),
    tmp = require('tmp'),
    mkdirp = require('mkdirp'),
    url = require('url'),
    path = require('path'),
    copy = require('../utils/copy'),
    rimraf = require('rimraf');

tmp.setGracefulCleanup();

var UrlResolver = function(pkg, logger, context) {
    this.pkg = pkg;
    this.logger = logger;
    this.context = context;
};

UrlResolver.prototype = {
    fetch: function() {
        var tmpDir = this.context.config.tmp,
            that = this,
            fileName = url.parse(path.basename(this.pkg.repository)).pathname,
            file;

        return Q.nfcall(mkdirp, tmpDir)
            .then(function () {
                return Q.nfcall(tmp.dir, {
                    template: path.join(tmpDir, process.pid + '-XXXXXX'),
                    mode: 0777 & ~process.umask(),
                    unsafeCleanup: true
                });
            }).then(function (dir) {
                tmpDir = dir;

                var defer = Q.defer(),
                    response;

                file = path.join(tmpDir, fileName);

                var req = request(that.pkg.repository);

                req.on('response', function(resp) {
                    response = resp;
                });


                req.pipe(fs.createWriteStream(file))
                .on('error', defer.reject)
                .on('close', function () {
                    defer.resolve(response);
                });

                return defer.promise;
            }).then(function(response) {

                var mimeType = response.headers['content-type'];

                if (mimeType) {
                    // Clean everything after ; and trim the end result
                    mimeType = mimeType.split(';')[0].trim();
                    // Some servers add quotes around the content-type, so we trim that also
                    mimeType = mout.string.trim(mimeType, ['"', '\'']);
                }

                if (!extract.canExtract(file, mimeType)) {
                    return Q.resolve();
                }

                return extract(file, tmpDir, {
                    mimeType: mimeType
                });
            }).then(function(extracted) {
                if (extracted) {
                    return Q.nfcall(rimraf, file);
                } else {
                    return Q.resolve();
                }
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

module.exports = UrlResolver;