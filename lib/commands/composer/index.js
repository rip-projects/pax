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
    d = require('simply-deferred'),
    composer = require('../../composer');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred();
    if (composer.manifest) {
        pax.log.out('Dependencies:');
        for(var i in composer.manifest.require) {
            pax.log.out(' ', i + '@' + composer.manifest.require[i]);
        }
    } else {
        deferred.reject(new Error('No composer dependencies'));
    }

    return deferred.promise();
};