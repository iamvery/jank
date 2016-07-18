var Attributes = Array.prototype.constructor;

Attributes.prototype.getNamedItem = function(name) {
  return this.find((attribute) => attribute.name == name);
};

var Attribute = function(name, value) {
  this.name = name;
  this.value = value;
};

var Node = function(tag, attrs, children) {
  this.tagName = tag;
  this.attributes = Attributes.apply({}, attrs || []);
  this.childNodes = children || [];
  this.nodeType = 1; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
};

var Text = function(content) {
  this.wholeText = content;
  this.nodeType = 3; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
};

module.exports = {Attribute, Node, Text};
