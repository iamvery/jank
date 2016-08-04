var attrsToProps = require('./attrs-to-props');

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
var NodeType = {
  TEXT: 3,
  COMMENT: 8,
};

function applyArray(node, data, creater) {
  // TODO arrays of elements must be wrapped in an outer element to keep React
  // happy upstream. For now this is the simplest approach, but it's a little
  // naive. E.g. downstream elements might be `li`s. In that case, it's invalid
  // markup to have them wrapped in a div. There are probably many more edge
  // cases, so we're biasing towards invalid markup over fixing these problems
  // at this time.
  var tag = 'div';
  var props = {};
  var content = data.map(function(d) { return apply(node, d, creater) });
  return {tag: tag, props: props, content: content, data: data};
}

function applyText(node, data) {
  return [data];
}

function applyAttrs(props, attrs) {
  for (key in attrs) {
    if (key !== '_attrs_') props[key] = attrs[key];
  }
  return props;
}

function applyObject(node, data, creater) {
  return Array.prototype.map.call(node.childNodes, function(child) { return transform(child, data, creater) });
}

function apply(node, data, creater) {
  creater = creater || function(o) { return o };
  if (Array.isArray(data)) { return creater(applyArray(node, data, creater)) }

  var tag = node.tagName;
  var props = attrsToProps(node.attributes);

  if (typeof data === 'string') { var content = applyText(node, data) }
  else if (isAttrs(data)) {
    props = applyAttrs(props, data);
    var content = [];
  }
  else { var content =  applyObject(node, data, creater) }

  return creater({tag: tag, props: props, content: content, data: data});
}

function isAttrs(data) {
  return data._attrs_ === true;
}

function getScope(attributes) {
  var attr = attributes.getNamedItem('data-prop');
  return attr && attr.value;
}

function transform(node, data, creater) {
  if (node.nodeType == NodeType.TEXT) { return node.wholeText }
  else if (node.nodeType == NodeType.COMMENT) { return null }

  var scope = getScope(node.attributes);
  var data = scope ? data[scope] : data;

  return apply(node, data, creater);
}

module.exports = {apply: apply, transform: transform};
