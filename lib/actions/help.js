module.exports = function(logger) {
    logger.log('');
    logger.log('PAX version', this.version.green);
    logger.log('');
    logger.log('', 'Usage:'.yellow, 'xpax <command>');
    logger.log('');
};