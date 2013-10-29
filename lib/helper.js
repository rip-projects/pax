var url = require('url'),
    path = require('path'),
    fs = require('fs'),
    readJson = require('read-package-json'),
    exec = require('child_process').exec,
    helper = {
        p: function(uri) {
            var parsed = url.parse(uri);
            if (parsed.protocol == 'app:') {
                return path.join(__dirname, '..', parsed.pathname);
            } else if (parsed.protocol == 'cwd:') {
                return path.join(process.cwd(), parsed.pathname);
            } else {
                return uri;
            }
        },
        w: function(uri, content, cb) {
            if (typeof(content) !== 'string') {
                content = JSON.stringify(content, null, 2);
            }

            fs.writeFile(p(uri), content, cb);
        },
        r: function(uri, cb) {
            var absolutePath = p(uri);
            if (path.basename(uri) == 'package.json') {
                readJson(absolutePath, console.error, false, function(err, data) {
                    if (err) {
                        if (cb) cb(new Error('No package.json'));
                        return;
                    }

                    if (cb) cb(null, data);
                });
            } else {
                try {
                    content = fs.readFileSync(absolutePath, { encoding: 'utf8' });
                    if (cb) cb(null, JSON.parse(content));
                } catch(e) {
                    if (cb) cb(new Error('Error read file'));
                }
            }
        },
        m: function(uri) {
            uri = p(uri);
            var i,
                file,
                stat,
                retval = [],
                dirs = [],
                files = [],
                children = fs.readdirSync(uri);

            for(i in children) {
                file = path.join(uri, children[i]);
                stat = fs.statSync(file);
                if (stat.isFile()) {
                    files.push(file);
                } else if (stat.isDirectory()) {
                    var subFiles = m(file);
                    for(var j in subFiles) {
                        retval.push(subFiles[j]);
                    }
                }
            }

            for(i in files) {
                retval.push(files[i]);
            }

            return retval;
        },
        e: function(cmd, callback) {
            exec(cmd, function(err, stdout, stderr) {
                callback(err, (err) ? stderr : stdout);
            });
            // if (callback) {
            //     var options = {
            //         silent: true,
            //         async: true
            //     };
            //     return exec(cmd, options, callback);
            // } else {
            //     return exec(cmd);
            // }
        },
        d: require('simply-deferred')
    },
    p = helper.p,
    m = helper.m;

module.exports = helper;