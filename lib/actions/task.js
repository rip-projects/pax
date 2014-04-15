module.exports = function(logger) {
    "use strict";

    var found = false;

    logger.log('');
    logger.log('Available tasks:'.yellow);
    for(var i in this.tasks) {
        found = true;
        logger.log(' ', i.blue.bold, this.tasks[i].description);
    }

    if (!found) {
        logger.log(' ', '(none)');
    }

    return this.tasks;
};