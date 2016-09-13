var React = require('react');
var ReactDOM = require('react-dom');
var ElementGroups = require('./jank/grouping');
var createComponent = require('./jank/component').createComponent;

function wrap(elements) {
  var wrapper = document.createElement('div');
  elements[0].insertAdjacentElement('beforebegin', wrapper);
  elements.forEach(function(post) { wrapper.appendChild(post) });
  return wrapper;
}

var Jank = {
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

    grouped.forEach((group) => {
      var template = group.elements[0];
      var wrapper = wrap(group.elements);
      var channel = channelInit(group.topic);
      var component = createComponent(template, channel);

      if (data) {
        ReactDOM.render(React.createElement(component, {data: data}), wrapper);
      } else {
        channel.init(function(data){
          ReactDOM.render(React.createElement(component, {data: data}), wrapper);
        });
      }
    });
  }
};

module.exports = Jank;
