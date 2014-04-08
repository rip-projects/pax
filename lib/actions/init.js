var Q = require('q'),
    resolve = require('../utils/resolve');
// var resolverFactory = require('bower/lib/core/resolverFactory');

var print = function() {

};

module.exports = function(pkg, logger) {
    "use strict";

    var that = this,
        deferred = Q.defer();

    this.exec(['search', pkg]).then(function(searchResults) {
        if (searchResults[0]) {
            var row = searchResults[0];

            var decEndpoint = {
                source: row.repository
            };

            resolve(row, logger, that).then(function(resolver) {
                resolver.fetch()
                    .then(function(a) {
                        return resolver.init(a);
                    });
            });
        } else {
            deferred.reject(new Error('Package ' + pkg + ' not found!'));
        }
    });

    return deferred.promise;
};
