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
    _ = require('lodash'),
    logger = require('../../index').log;

var composer = function(pax, args, opts) {
    opts = opts || {};
    var deferred = d.Deferred(),
        log = opts.log || composer.log;

    log.data('start');

    if (composer.manifest) {
        for(var i in composer.manifest.require) {
            log.data('dependency', {
                name:i,
                version:composer.manifest.require[i]
            });
        }
    }

    log.data('end');

    if (composer.manifest) {
        deferred.resolve();
    } else {
        deferred.reject(new Error('No composer dependencies'));
    }

    return deferred.promise();
};

var logState = '';
composer = _.extend(composer, {
    init: function() {
        var composerFile = './composer.json';
        if (fs.existsSync(composerFile)) {
            composer.manifest = JSON.parse(fs.readFileSync(composerFile, { encoding: 'utf8' }));
        } else {
            composer.manifest = null;
        }
    },
    log: {
        data: function(state, data) {
            if (state == 'start' || state == 'end') {
                logState = '';
            } else {
                if (logState != state) {
                    logState = state;
                    logger.out('\nComposer dependencies:'.bold);
                }
                logger.out('  - ' + data.name + '@' + data.version);
            }
        }
    }
});

composer.init();

module.exports = composer;