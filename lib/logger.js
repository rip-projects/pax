var sprintf = require('sprintf').sprintf;

var logger = {
    info: function() {
        var arg = ['I'.bold.blue];
        for(var i = 0; i < arguments.length; i++) {
            arg.push(arguments[i]);
        }
        logger.out.apply(null, arg);
    },
    error: function() {
        var arg = ['E'.bold.red];
        for(var i = 0; i < arguments.length; i++) {
            arg.push(arguments[i]);
        }
        console.error.apply(null, arg);
    },
    out: function() {
        console.log.apply(null, arguments);
    },
    data: function(type, data) {
        console.log('D'.bold.yellow, type.yellow, data);
    }
};

module.exports = logger;