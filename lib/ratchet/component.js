var React = require('react');
var attrsToProps = require('./attrs-to-props');

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
    var attrs = attrsToProps(child.attributes);
    var element = React.createElement.apply(undefined, [child.tagName, attrs].concat(children));
    elements.push(element);
    return elements;
  }, []);
}

function createComponent(node, data) {
  if (Array.isArray(data)) {
    return React.createElement('div', null, data.map((d) => createComponent(node, d)));
  }

  var props = attrsToProps(node.attributes);
  if (data.id) { props.key = data.id }
  var children = createChildren(node, data)
  return React.createElement.apply(undefined, [node.tagName, props].concat(children));
}

function Component(template, name, channel) {
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
      return createComponent(template, this.state.data);
    }
  });
}

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
var NodeType = {
  TEXT: 3,
};

function applyArray(node, data) {
  return data.map((d) => apply(node, d));
}

function applyText(node, data) {
  return [data];
}

function applyObject(node, data) {
  return Array.prototype.map.call(node.childNodes, (child) => createComp(child, data));
}

function apply(node, data, creater) {
  creater = creater || ((o) => o);
  if (Array.isArray(data)) { return creater(applyArray(node, data)) }

  var tag = node.tagName;
  var props = attrsToProps(node.attributes);

  if (typeof data === 'string') { var content = applyText(node, data) }
  // TODO attribute data???
  else { var content =  applyObject(node, data) }

  return creater({tag, props, content});
}

function createComp(node, data, creater) {
  if (node.nodeType == NodeType.TEXT) { return node.wholeText }

  var props = attrsToProps(node.attributes);
  var scope = props['data-prop'];
  var data = scope ? data[scope] : data;
  return apply(node, data, creater);
}

module.exports = {apply, Component, createComponent: createComp};
