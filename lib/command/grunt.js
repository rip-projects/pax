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