var React = require('react');

function propObj(attributes) {
  return Array.prototype.reduce.call(attributes, function(props, attribute) {
    var name = attribute.name;
    // TODO extract attr normalization routine
    if (name == 'class') name = 'className';
    props[name] = attribute.value;
    return props;
  }, {});
}

function createChildren(node, data) {
  return Array.prototype.reduce.call(node.childNodes, function(elements, child) {
    // TODO probably need more robust strategy for handling text/other node types
    if (child.attributes === undefined) {
      elements.push(child.wholeText);
      return elements;
    }
    var dataProp = child.attributes['data-prop'];
    var children;
    if (dataProp) { children = [data[dataProp.value]]; }
    else { children = createChildren(child, data); }
    var attrs = propObj(child.attributes);
    var element = React.createElement.apply(undefined, [child.tagName, attrs].concat(children));
    elements.push(element);
    return elements;
  }, []);
}

function Component(template, name, channel) {
  function createComponent(data) {
    var attrs = propObj(template.attributes);
    if (data.id) { attrs.key = data.id }
    var children = createChildren(template, data)
    return React.createElement.apply(undefined, [template.tagName, attrs].concat(children));
  }
  return React.createClass({
    getInitialState: function() {
      return {data: this.props.data};
    },
    componentWillMount: function() {
      var self = this;
      channel.data(function(payload) {
        self.setState({data: payload[name]});
      });
    },
    render: function() {
      var data = this.state.data;
      if (Array.isArray(data)) {
        return React.createElement('div', null, this.state.data.map(createComponent));
      } else {
        return createComponent(this.state.data);
      }
    }
  });
}

module.exports = Component;
