function Phoenix(channel) {
  this.channel = channel;
}

Phoenix.prototype.data = function(callback) {
  this.channel.on('data', callback);
}

module.exports = Phoenix;
