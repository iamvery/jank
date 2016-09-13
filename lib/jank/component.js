var React = require('react');
var transform = require('./transformer').transform;

function createElement(element) {
  // TODO this is confusing. It is an early return for "null" and any non-object value, e.g. plain text
  if (!element || typeof(element) != 'object') { return element }
  var tag = element.tag;
  var props = element.props;
  var content = element.content.map(createElement);
  return React.createElement.apply(undefined, [tag, props].concat(content));
}

function createComponent(template, channel) {
  return React.createClass({
    getInitialState: function() {
      return {data: this.props.data};
    },

    componentWillMount: function() {
      var self = this;
      channel.data(function(payload) {
        self.setState({data: payload});
      });
    },

    render: function() {
      return createElement(transform(template, this.state.data));
    }
  });
}

module.exports = {createComponent: createComponent};
