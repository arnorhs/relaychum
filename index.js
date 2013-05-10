var through = require('through');
var duplexer = require('duplexer');
var split = require('split');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate : process.nextTick
;

module.exports = function () {
    return new Chum;
};

function Chum () {}

Chum.prototype.createStream = function () {
    var self = this;
    var input = split();
    var output = input.pipe(through(function (line) {
        try { var msg = JSON.parse(line) }
        catch (err) {
            input.destroy();
            output.destroy();
            return;
        }
        self._handle(msg);
    }));
    nextTick(function () {
        output.queue('[1,2,3]\n');
    });
    return duplexer(input, output);
};

Chum.prototype._handle = function (msg) {
    var self = this;
    console.dir(msg);
};
