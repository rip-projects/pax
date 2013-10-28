var helper = require('./helper'),
    p = helper.p,
    e = helper.e,
    d = helper.d;

var resolve = require('resolve').sync;

module.exports = {
    run: function() {
        var deferred = new d.Deferred(),
            target = this.optimist.argv._[0];
        // initialize
        var gruntfilePath = resolve('grunt-pax-task', {basedir: process.cwd()});
        cp('-f', gruntfilePath, './');

        e('grunt help:raw', function(code, output) {
            output = output.split("\n");
            var targets = {};
            for(var i in output) {
                if (output[i]) {
                    targets[output[i]] = output[i];
                }
            }
            if (targets[target]) {
                e('grunt ' + target);
            } else {
                deferred.reject();
            }

            // finalize
            rm('-rf', p('cwd:///Gruntfile.js'));

            deferred.resolve();
        });

        return deferred.promise();
    }
};