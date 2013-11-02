var helper = require('../helper'),
    d = helper.d;


var bowerModule = module.exports = {
    name: 'bower',
    description: 'Enable bower to project.',

    add: function(sub, package) {
        var deferred = new d.Deferred();

        getManifest(function(err, data) {

        });

        return deferred.promise();
    },

    run: function(sub) {
        sub = sub || 'list';

        var deferred = new d.Deferred();

        if (typeof bowerModule[sub] == 'function' && sub != 'run') {
            bowerModule[sub].apply(bowerModule, arguments).then(deferred.resolve, deferred.reject);
        } else {
            console.log('Command: "bower ' + sub + '" is not available.');
            deferred.reject();
        }

        return deferred.promise();
    }
};