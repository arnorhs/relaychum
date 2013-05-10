# relaychum

friend-to-friend anonymous darknet

# example

``` js
var relaychum = require('relaychum');
var relay = relaychum();

var http = require('http');
var server = http.createServer(function (req, res) {
    if (req.url === '/relay') {
        res.connection.setTimeout(0);
        req.pipe(relay.createStream()).pipe(res);
    }
    else res.end('relaychum\n');
});
server.listen(5000);
```


