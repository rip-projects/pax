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
    logger;

var cmd = function(pax, args, opts) {
    logger = pax.log;
    opts = opts || {};

    var deferred = d.Deferred(),
        bowerFile = './bower.json',
        log = opts.log || cmd.log;

    log.data('start');

    if (fs.existsSync(bowerFile)) {
        var manifest = JSON.parse(fs.readFileSync(bowerFile, { encoding: 'utf8' }));

        for(var i in manifest.dependencies) {
            log.data('dependency', {
                name: i,
                version: manifest.dependencies[i]
            });
        }
    }

    log.data('end');

    if (fs.existsSync(bowerFile)) {
        deferred.resolve();
    } else {
        deferred.reject(new Error('No bower dependencies'));
    }

    return deferred.promise();
};

var logState = '';
cmd.log = {
    data: function(state, data) {
        if (state == 'start' || state == 'end') {
            logState = '';
        } else {
            if (logState != state) {
                logState = state;
                logger.out('\nBower dependencies:'.bold);
            }
            logger.out('  - ' + data.name + '@' + data.version);
        }
    }
};

module.exports = cmd;