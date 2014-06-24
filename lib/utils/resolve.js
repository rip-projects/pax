var Q = require('q');

module.exports = function(pkg, logger, context) {
    "use strict";

    var deferred = Q.defer(),
        Resolver;

    if (/^git(\+(ssh|https?))?:\/\//i.test(pkg.repository) || /\.git\/?$/i.test(pkg.repository) || /^git@/i.test(pkg.repository)) {
        Resolver = require('../resolvers/git');
    } else if (/^https?:\/\//i.exec(pkg.repository)) {
        Resolver = require('../resolvers/url');
    }

    if (Resolver) {
        deferred.resolve(new Resolver(pkg, logger, context));
    } else {
        deferred.reject(new Error('Resolver not found!'));
    }

    return deferred.promise;
};