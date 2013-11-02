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

var spawn = require('child_process').spawn,
    d = require('simply-deferred');

module.exports = function(pax, args, opts) {
    var deferred = d.Deferred(),
        packageFile = 'package.json';

    var found = require('matchdep').filterDev('grunt-' + args[0], process.cwd() + '/' + packageFile);
    if (found.length <= 0) {
        var insDep = spawn('npm', ['install', 'grunt-' + args[0], '--save-dev'], {stdio: 'inherit'});
        insDep.on('close', function(code) {
            if (code > 0) {
                deferred.reject(new Error('NPM error occured.'));
            } else {
                deferred.resolve();
            }
        });
    } else {
        pax.log.info(args[0], 'already exists.');
        deferred.resolve();
    }

    return deferred.promise();
};