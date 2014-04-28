module.exports = function(logger) {
    logger.log(c.head('PAX'), 'version', c.success(this.version));
    logger.log(' ', c.head('Usage:'), 'xpax <command>');
};