var d = require('../helper').d;

module.exports = {
    name: 'h',
    alias: 'help',
    matcher: function(argv) {
        return this.optimist.argv.h;
    },

    run: function() {
        this.optimist.showHelp();
        return (new d.Deferred()).resolve().promise();
    }
};