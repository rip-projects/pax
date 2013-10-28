var helper = require('./helper'),
    resolve = require('resolve').sync,
    p = helper.p,
    e = helper.e,
    d = helper.d;

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
                e('grunt ' + target, function(code, output) {
                    console.log(output);
                    deferred.resolve();
                    // finalize
                    rm('-rf', p('cwd:///Gruntfile.js'));
                });
            } else {
                deferred.reject();
                // finalize
                rm('-rf', p('cwd:///Gruntfile.js'));
            }

        });

        return deferred.promise();
    }
};