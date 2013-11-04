var d = require('simply-deferred'),
    _ = require('lodash'),
    pax = require('../../index'),
    fs = require('fs');

var dep = function(pax, args, opts) {
    var deps = dep.getPackageDependencies(),
        deferred = d.Deferred(),
        w = d.when(function() {});

    for(var i in deps) {
        w = w.then(pax.command.get([deps[i]]));
    }

    w.then(deferred.resolve, deferred.reject);

    return deferred.promise();
};

dep = _.extend(dep, {
    getPackageDependencies: function() {
        var deps = pax.pkg.config('dependencies') || [];
        if (deps.length === 0) {
            if (fs.existsSync('bower.json')) deps.push('bower');
            if (fs.existsSync('composer.json')) deps.push('composer');
        }
        return deps;
    }
});

module.exports = dep;