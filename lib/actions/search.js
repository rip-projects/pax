var Q = require('q'),
    request = require('request'),
    _ = require('lodash');

module.exports = function(q, logger) {
    "use strict";

    if (arguments.length < 2) {
        logger = q;
        q = '';
    }

    var deferred = Q.defer(),
        url = this.url('/package.json');

    request(url, this.config.request, function (error, response, body) {
        var data = null;
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body);
            } catch(e) {
                return deferred.reject(new Error('Parsing error, maybe server error'));
            }
        } else {
            return deferred.reject(new Error(error || 'Error accessing /package.json'));
        }

        var result = _.where(data.entries || [], function(row) {
            return (row.name.indexOf(q) >= 0);
        });

        // logging
        logger.log('Search results');
        _.forEach(result, function(row) {
            logger.log(' ', row.name + ' ' + row.repository);
        });

        deferred.resolve(result);

    });

    return deferred.promise;
};
