var helper = require('./helper'),
    resolve = require('resolve').sync,
    p = helper.p,
    e = helper.e,
    d = helper.d;

module.exports = {
    run: function() {
        var deferred = new d.Deferred();
            // originalTarget = this.optimist.argv._[0],
            // targetSegments = originalTarget.split(':'),
            // target = targetSegments[0];

        // initialize
        var gruntfilePath = resolve('grunt-pax-task', {basedir: process.cwd()});
        cp('-f', gruntfilePath, './');

        var grunt = require(resolve('grunt', {basedir: process.cwd()}));

        grunt.fail.fatal = function(e) {
            console.log('Grunt fatal error:', e);
        };

        grunt.fail.warn = function(e) {
            var message = typeof e === 'string' ? e : e.message;
            grunt.fail.warncount++;
            console.log('Grunt warn:', message);
        };
        // grunt.cli();
        grunt.tasks(this.optimist.argv._, [], function() {
            if (grunt.fail.warncount) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
            // finalize
            rm('-rf', p('cwd:///Gruntfile.js'));
        });

        return deferred.promise();
    }
};