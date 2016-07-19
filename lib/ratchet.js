var React = require('react');
var ReactDOM = require('react-dom');
var createComponent = require('./ratchet/component').createComponent;

var Ratchet = {
  init: function(opts) {
    var data = opts.data;
    var channelInit = opts.channelInit;

    // Note: This will fail as is when no existing data is in the view, because in
    // that case no view will be present at all.
    var components = document.querySelectorAll('[data-component]');

    var grouped = Array.prototype.reduce.call(components, function(groups, comp) {
      var kind = comp.attributes['data-prop'].value;
      var parent = comp.parentNode;
      var key = [kind, parent];
      var group = groups.find(function(entry) { if (entry[0] == key) { return entry } })
      if (!group) { group = [key, [comp]]; groups.push(group) }
      else { group[1].push(comp) }
      return groups;
    }, []);

    for (var i = 0; i < grouped.length; i++) {
      var group = grouped[i];
      var kind = group[0][0];
      var elements = group[1];
      var wrapper = document.createElement('div');
      var template = elements[0];
      var channel = channelInit(kind);
      template.insertAdjacentElement('beforebegin', wrapper);
      elements.forEach(function(post) {
        wrapper.appendChild(post);
      });

      var component = createComponent(template, kind, channel);

      if (data) {
        ReactDOM.render(React.createElement(component, {data: data}), wrapper);
      } else {
        channel.init(function(payload){
          ReactDOM.render(React.createElement(component, {data: payload}), wrapper);
        });
      }
    }
  }
};

module.exports = Ratchet;
