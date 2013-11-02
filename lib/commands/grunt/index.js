/**
 * pax
 * https://github.com/reekoheek/pax
 *
 * Copyright (c) 2013 PT Sagara Xinix Solusitama
 * Licensed under the MIT license.
 * https://github.com/reekoheek/pax/blob/master/LICENSE
 *
 * Composer command
 *
 */

var fs = require('fs'),
    d = require('simply-deferred');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred();

    try {
        pax.log.out('Grunt tasks:');
        require('matchdep').filterDev('grunt-*', process.cwd() + '/package.json').forEach(function(file) {
            pax.log.out(' ', file.substr(6));
        });
    } catch(e) {
        deferred.reject(new Error('No grunt tasks'));
    }

    return deferred.promise();
};