function FakePhoenixChannel(data) {};

FakePhoenixChannel.prototype.on = function(_event, callback) {
  this.callback = callback;
};

FakePhoenixChannel.prototype.synthesize = function(data) { this.callback(data); }

module.exports = FakePhoenixChannel;
