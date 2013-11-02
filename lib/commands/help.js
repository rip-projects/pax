module.exports = function(pax, args, opts) {
    var usage = 'PAX'.rainbow.bold + ' version ' + pax.systemPackage.version + '\n' +
        '\n' +
        'Usage:'.bold + ' pax [options..] [command] [args..]\n' +
        '\n' +
        'Command:\n'.bold +
        '  init'.green + '             Initialize project\n' +
        '  clean'.green + '            Grunt clean project task\n' +
        '  dependencies'.green + '     Grunt fetch dependencies task\n' +
        '  build'.green + '            Grunt build project task\n' +
        '\n' +
        'Option:\n'.bold +
        '  -h, --help'.green + '       See this page';
    pax.log.out(usage);
};