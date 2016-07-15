function Phoenix(channel) {
  this.channel = channel;
}

Phoenix.prototype.init = function(callback) {
  var onMessage = this.channel.onMessage;
  this.channel.onMessage = function(event, payload, ref) {
    if (event == 'data') {
      callback(payload);
      this.onMessage = onMessage;
    }
    return payload;
  };
}

Phoenix.prototype.data = function(callback) {
  this.channel.on('data', callback);
}

module.exports = Phoenix;
