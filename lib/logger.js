var sprintf = require('sprintf').sprintf;

var logger = {
    info: function() {
        var d = new Date(),
            sD = sprintf('%02d/%02d/%04d %02d:%02d:%02d', d.getDate(), (d.getMonth() + 1), (d.getYear() + 1900), d.getHours(), d.getMinutes(), d.getSeconds()),
            arg = [sD, 'info>'];
        for(var i = 0; i < arguments.length; i++) {
            arg.push(arguments[i]);
        }
        logger.out.apply(null, arg);
    },
    error: function() {
        var d = new Date(),
            sD = sprintf('%02d/%02d/%04d %02d:%02d:%02d', d.getDate(), (d.getMonth() + 1), (d.getYear() + 1900), d.getHours(), d.getMinutes(), d.getSeconds()),
            arg = [sD, 'err>'];
        for(var i = 0; i < arguments.length; i++) {
            arg.push(arguments[i]);
        }
        console.error.apply(null, arg);
    },
    out: function() {
        console.log.apply(null, arguments);
    }
};

module.exports = logger;