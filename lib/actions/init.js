var Q = require('q'),
    resolve = require('../utils/resolve'),
    fs = require('fs'),
    path = require('path');
// var resolverFactory = require('bower/lib/core/resolverFactory');

module.exports = function(pkg, logger) {
    "use strict";

    var that = this,
        deferred = Q.defer(),
        row = {
            repository: pkg
        };


    if (typeof pkg == 'object') {
        this.logger.error('No paxfile.js');
        return;
    }


    resolve(row, logger, that).then(function(resolver) {
        logger.head('Fetching package...');
        resolver.fetch()
            .then(function(a) {
                logger.head('Initializing archetype...');
                return resolver.init(a);
            })
            .then(function() {
                return that.initTask();
            })
            .then(function() {
                return that.exec(['init'], logger);
            })
            .then(function() {
                deferred.resolve();
            },function(e) {
                deferred.reject(e);
            });
    }, function() {
        try {
            that.exec(['search', pkg]).then(function(searchResults) {
                row = null;
                if (searchResults[0]) {
                    row = searchResults[0];

                    return resolve(row, logger, that).then(function(resolver) {
                        logger.head('Fetching package...');
                        return resolver.fetch()
                            .then(function(a) {
                                logger.head('Initializing archetype...');
                                return resolver.init(a);
                            })
                            .then(function() {
                                return that.initTask();
                            })
                            .then(function() {
                                return that.exec(['init'], logger);
                            });
                    });
                } else {
                    throw new Error('Package ' + pkg + ' not found!');
                }
            }).then(function() {
                deferred.resolve();
            },function(e) {
                deferred.reject(e);
            });
        } catch(e) {
            deferred.reject(e);
        }
    });

    return deferred.promise;
};
