/**
 * pax
 * https://github.com/reekoheek/pax
 *
 * Copyright (c) 2013 PT Sagara Xinix Solusitama
 * Licensed under the MIT license.
 * https://github.com/reekoheek/pax/blob/master/LICENSE
 *
 * Grunt command
 * deprecated: this module will be moved to grunt-pax-task
 */

var helper = require('../helper'),
    resolve = require('resolve').sync,
    p = helper.p;

module.exports = {
    name: 'grunt',
    description: 'Install/uninstall gruntfile.',
    run: function(sub) {
        sub = sub || 'install';
        if (sub == 'install') {
            var gruntfilePath = resolve('grunt-pax-task', {basedir: process.cwd()});
            cp('-f', gruntfilePath, './');
        } else {
            rm('-rf', p('cwd:///Gruntfile.js'));
        }
    }
};