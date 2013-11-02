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
        var manifest = JSON.parse(fs.readFileSync(bowerFile, {encoding:'utf8'}));
        if (manifest && manifest.dependencies && manifest.dependencies[args[0]]) {
            delete manifest.dependencies[args[0]];
            fs.writeFileSync(bowerFile, JSON.stringify(manifest, null, 2));
            rm('-rf', './bower_components/' + args[0]);
            deferred.resolve();
        } else {
            deferred.reject(new Error('No bower dependency:' + args[0]));
        }
    } else {
        deferred.reject(new Error('No bower dependencies'));
    }

    return deferred.promise();
};