var React = require('react');
var ReactDOM = require('react-dom');
var ElementGroups = require('./ratchet/grouping');
var createComponent = require('./ratchet/component').createComponent;

var Ratchet = {
  init: function(opts) {
    var data = opts.data;
    var channelInit = opts.channelInit;

    // Note: This will fail as is when no existing data is in the view, because in
    // that case no view will be present at all.
    var components = document.querySelectorAll('[data-component]');

    var grouped = Array.prototype.reduce.call(components, function(groups, comp) {
      groups.add(comp)
      return groups;
    }, new ElementGroups());

    for (var i = 0; i < grouped.length; i++) {
      var group = grouped[i];
      var wrapper = document.createElement('div');
      var template = group.elements[0];
      var channel = channelInit(group.kind);
      template.insertAdjacentElement('beforebegin', wrapper);
      group.elements.forEach(function(post) {
        wrapper.appendChild(post);
      });

      var component = createComponent(template, group.kind, channel);

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
