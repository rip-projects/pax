var d = require('simply-deferred');

module.exports = function(pax, args, opts) {
    var deps = pax.pkg.config('dependencies'),
        deferred = d.Deferred(),
        w = d.when(function() {});

    for(var i in deps) {
        w = w.then(pax.command.get([deps[i], 'clean']));
    }

    w.then(deferred.resolve, deferred.reject);

    return deferred.promise();
};