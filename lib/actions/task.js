module.exports = function(logger) {
    "use strict";

    var found = false;

    logger.head('Available tasks:');
    for(var i in this.tasks) {
        found = true;
        logger.log(' ', c.success(i), this.tasks[i]);
    }

    if (!found) {
        logger.log(' ', c.error('none'));
    }

    return this.tasks;
};