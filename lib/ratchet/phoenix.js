function DataChannel(socket, property) {
  // this is all specific to phoenix sockets
  var topic = "data:" + property;
  var channel = socket.channel(topic);
  channel.join()
    .receive("ok", function(resp) { console.log("Joined \"" + topic + "\"") })
    .receive("error", function(resp) { console.log("Unable to join \"" + topic + "\"") });
  return channel;
}

module.exports = DataChannel;
