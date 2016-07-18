var React = require('react');
var {transform} = require('./transformer');

function createElement({tag, props, content}) {
  return React.createElement.apply(undefined, [tag, props].concat(content));
}

function Component(template, name, channel) {
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
      return transform(template, this.state.data, createElement);
    }
  });
}

module.exports = {Component};
