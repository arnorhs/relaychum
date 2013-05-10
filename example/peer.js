var net = require('net');
var argv = require('optimist').argv;
var through = require('through');
var relaychum = require('../');
var relay = relaychum();

argv._.forEach(function (arg) {
    if (/^\d+$/.test(arg)) {
        var server = net.createServer(function (stream) {
            stream.pipe(relay.createStream()).pipe(stream);
        });
        server.listen(arg);
    }
    else {
        var parts = arg.split(':');
        var host = parts[0], port = parts[1];
        var stream = net.connect(port, host);
        stream.pipe(relay.createStream()).pipe(stream);
    }
});
