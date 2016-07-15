var React = require('react');
var ReactDOM = require('react-dom');
var Component = require('./ratchet/component');

var Ratchet = {
  init: function(opts) {
    var data = opts.data;
    var channelInit = opts.channelInit;
    // Note: This will fail as is when no existing data is in the view, because in
    // that case no view will be present at all.
    var components = document.querySelectorAll('[data-component]');
    // assumes all components are adjacent (for now)
    // in the future we'll need to be able to:
    // - group them by common parent and kind
    var grouped = Array.prototype.reduce.call(components, function(groups, comp) {
      var kind = comp.attributes['data-prop'].value;
      groups[kind] = groups[kind] || [];
      groups[kind].push(comp);
      return groups;
    }, {});

    for (var kind in grouped) {
      var elements = grouped[kind];
      var wrapper = document.createElement('div');
      var template = elements[0];
      var channel = channelInit(kind);
      template.insertAdjacentElement('beforebegin', wrapper);
      elements.forEach(function(post) {
        wrapper.appendChild(post);
      });

      var component = Component(template, kind, channel);

      if (data) {
        ReactDOM.render(React.createElement(component, {data: data[kind]}), wrapper);
      } else {
        var onMessage = channel.onMessage;
        channel.onMessage = function(event, payload, ref) {
          if (event == 'data') {
            console.log("boot");
            ReactDOM.render(React.createElement(component, {data: payload}), wrapper);
            channel.onMessage = onMessage;
          }
          return payload;
        };
      }
    }
  }
};

module.exports = Ratchet;
