var Q = require('q'),
    request = require('request'),
    _ = require('lodash');

module.exports = function(q, logger) {
    "use strict";

    var deferred = Q.defer();

    request(this.url('/package.json'), function (error, response, body) {
        var data = null;
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
        }

        var result = _.where(data.entries || [], function(row) {
            return (row.name.indexOf(q) >= 0);
        });

        // logging
        logger.log('Search results');
        _.forEach(result, function(row) {
            logger.log(row.name.yellow, row.repository);
        });

        deferred.resolve(result);

    });

    return deferred.promise;
};
