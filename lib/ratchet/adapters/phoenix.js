function Phoenix(channel) {
  this.channel = channel;
  this.initCallbacks = [];
}

Phoenix.prototype.init = function(callback) {
  this.initCallbacks.push(callback);
  var callbacks = this.initCallbacks;
  var onMessage = this.channel.onMessage;
  this.channel.onMessage = function(event, payload, ref) {
    if (event == 'data') {
      callbacks.forEach(function(cb) { cb(payload) });
      this.onMessage = onMessage;
    }
    return payload;
  };
}

Phoenix.prototype.data = function(callback) {
  this.channel.on('data', callback);
}

module.exports = Phoenix;
