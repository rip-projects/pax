var gulp = require('gulp');

module.exports = function(logger) {
    logger.log(c.head('PAX'), 'version', c.success(this.options.version), '(' + this.options.name + ')');
    logger.log('');
    logger.log(this.options.description);
    logger.log('');
    logger.log(' ', c.head('Usage:'), 'xpax <command>');
    logger.log('');
};