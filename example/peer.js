var net = require('net');
var argv = require('optimist').argv;
var relaychum = require('../');
var relay = relaychum({ id: argv.id });
relay.on('message', function (msg) {
    console.log('received message: ' + msg);
});

var sendParams;

for (var i = 0; i < argv._.length; i++) {
    var arg = argv._[i];
    if (arg === 'send') {
        sendParams = [argv._[i+1], argv._[i+2]];
        break;
    }
    else if (/^\d+$/.test(arg)) {
        var server = net.createServer(function (stream) {
            stream.pipe(relay.createStream()).pipe(stream);
        });
        server.listen(arg);
    }
    else {
        var parts = arg.split(':');
        var host = parts[0], port = parts[1];
        var stream = net.connect(port, host, function() {
            sendParams && relay.send(sendParams[0], sendParams[1]);
        });
        stream.pipe(relay.createStream()).pipe(stream);
    }
}
