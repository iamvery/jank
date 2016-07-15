function FakePhoenixChannel(data) {
  this.onMessage = () => {};
};

FakePhoenixChannel.prototype.on = function(_event, callback) {
  this.callback = callback;
};

FakePhoenixChannel.prototype.synthesize = function(data) {
  this.onMessage('data', data);
  this.callback && this.callback(data);
}

module.exports = FakePhoenixChannel;
