module.exports = function(logger) {
    "use strict";

    logger.log('Configuration:');
    for( var i in this.config) {
        logger.log(' ', i + ': ' + JSON.stringify(this.config[i]));
    }
};