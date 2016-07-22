var dataEvent = 'data';

function Phoenix(channel) {
  this.channel = channel;
  var callbacks = this.initCallbacks = [];

  var onMessage = this.channel.onMessage;
  this.channel.onMessage = function(event, payload, ref) {
    if (event == dataEvent) {
      callbacks.forEach(function(cb) { cb(payload) });
      this.onMessage = onMessage;
    }
    return payload;
  };
}

Phoenix.prototype.init = function(callback) {
  this.initCallbacks.push(callback);
}

Phoenix.prototype.data = function(callback) {
  this.channel.on(dataEvent, callback);
}

module.exports = Phoenix;
