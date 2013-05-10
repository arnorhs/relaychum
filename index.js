var through = require('through');
var duplexer = require('duplexer');
var split = require('split');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate : process.nextTick
;

var crypto = require('crypto');
function hash (msg) {
    return crypto.createHash('md5').update(msg).digest('base64');
}

module.exports = function (opts) {
    if (!opts) opts = {};
    return new Chum(opts);
};

inherits(Chum, EventEmitter);

function Chum (opts) {
    this.seen = {};
    this.peers = {};
    this._peerId = 0;
    this.id = opts.id;
}

Chum.prototype.createStream = function () {
    var self = this;
    var input = split();
    
    var output = input.pipe(through(function (msg) {
        self._handle(peerId, msg);
    }));
    output.on('close', function () {
        delete self.peers[peerId];
    });
    var peerId = self._peerId ++;
    self.peers[peerId] = output;
    
    return duplexer(input, output);
};

Chum.prototype._handle = function (from, line) {
    var self = this;
    var h = hash(line);
    if (self.seen[h]) return;
    self.seen[h] = true;
    try { var msg = JSON.parse(line) }
    catch (err) { return }
    
    if (msg[0] === self.id) {
        self.emit.apply(self, [ 'message' ].concat(msg.slice(1)));;
    }
    
    Object.keys(self.peers).forEach(function (id) {
        if (id !== from) self.peers[id].queue(line);
    });
};

Chum.prototype.send = function (who, msg) {
    var s = JSON.stringify([ [].concat(who).filter(Boolean), msg ]) + '\n';
    Object.keys(self.peers).forEach(function (id) {
        self.peers[id].queue(s);
    });
};
