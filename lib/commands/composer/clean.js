/**
 * pax
 * https://github.com/reekoheek/pax
 *
 * Copyright (c) 2013 PT Sagara Xinix Solusitama
 * Licensed under the MIT license.
 * https://github.com/reekoheek/pax/blob/master/LICENSE
 *
 */

var d = require('simply-deferred'),
    pax = require('../../index'),
    defaultLog = {
        data: function(type, data) {
            if (type=='start') {
                pax.log.out('\nComposer cleaning...'.bold);
            } else if (data) {
                pax.log.out('  - Remove', data);
            }
        }
    };

module.exports = function(pax, args, opts) {
    opts = opts || {};

    var deferred = d.Deferred(),
        log = opts.log || defaultLog;

    log.data('start');

    rm('-rf', 'vendor');
    log.data('rm', 'vendor');

    rm('-rf', 'composer.lock');
    log.data('rm', 'composer.lock');


    log.data('end');

    deferred.resolve();

    return deferred.promise();
};