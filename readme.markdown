# relaychum

friend-to-friend anonymous darknet

# example

``` js
var net = require('net');
var argv = require('optimist').argv;
var through = require('through');
var relaychum = require('relaychum');
var relay = relaychum({ id: argv.id });
relay.on('message', function (msg) {
    console.log('received message: ' + msg);
});

for (var i = 0; i < argv._.length; i++) {
    var arg = argv._[i];
    if (arg === 'send') {
        setTimeout(function () {
            relay.send(argv._[i+1], argv._[i+2]);
        }, 500);
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
        var stream = net.connect(port, host);
        stream.pipe(relay.createStream()).pipe(stream);
    }
}
```

now start servers A through C:

```
$ node example/peer.js 5000 --id=A
```

```
$ node example/peer.js 5001 localhost:5000 --id=B
```

```
$ node example/peer.js 5002 localhost:5001 --id=C
```

then join the network, connected to A and send a message to C:

```
$ node example/peer.js localhost:5002 send A 'beep boop'
```

now A will show:

```
received message: beep boop
```

# methods

``` js
var relaychum = require('relaychum')
```

## var relay = relaychum(opts)

Create a new relay with `opts.id`.

## relay.createStream()

Return a new stream for replicating with your peers.

## relay.send(who, msg)

Send `msg` to an array of recipients `who`. `who` can be empty, in which case
the recipient is anonymous.

# events

## relay.on('message', function (msg) {})

Whenever a message is addressed to your `id`, this event fires.

# install

With [npm](https://npmjs.org) do:

```
npm install relaychum
```

# license

MIT
