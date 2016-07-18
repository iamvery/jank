var attrsToProps = require('./attrs-to-props');

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
var NodeType = {
  TEXT: 3,
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

function applyObject(node, data, creater) {
  return Array.prototype.map.call(node.childNodes, function(child) { return transform(child, data, creater) });
}

function apply(node, data, creater) {
  creater = creater || function(o) { return o };
  if (Array.isArray(data)) { return creater(applyArray(node, data, creater)) }

  var tag = node.tagName;
  var props = attrsToProps(node.attributes);

  if (typeof data === 'string') { var content = applyText(node, data) }
  // TODO attribute data???
  else { var content =  applyObject(node, data, creater) }

  return creater({tag: tag, props: props, content: content, data: data});
}

function getScope(attributes) {
  var attr = attributes.getNamedItem('data-prop');
  return attr && attr.value;
}

function transform(node, data, creater) {
  if (node.nodeType == NodeType.TEXT) { return node.wholeText }

  var scope = getScope(node.attributes);
  var data = scope ? data[scope] : data;

  return apply(node, data, creater);
}

module.exports = {apply: apply, transform: transform};
