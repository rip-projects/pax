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
    var deferred = d.Deferred(),
        bowerFile = './bower.json';

    if (fs.existsSync(bowerFile)) {
        var manifest = JSON.parse(fs.readFileSync(bowerFile, { encoding: 'utf8' }));

        pax.log.out('Dependencies:');
        for(var i in manifest.dependencies) {
            pax.log.out(' ', i + '@' + manifest.dependencies[i]);
        }
        deferred.resolve();
    } else {
        deferred.reject(new Error('No bower dependencies'));
    }

    return deferred.promise();
};