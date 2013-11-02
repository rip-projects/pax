var fs = require('fs'),
    pax = {
    systemPackage: JSON.parse(fs.readFileSync(__dirname + '/../package.json', {encoding: 'utf8'})),
    log: require('./logger'),
    command: require('./command'),
    pkg: require('./pkg')
};

pax.command.init(pax);

module.exports = pax;