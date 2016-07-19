var equal = require('array-equal');

var Group = function(kind, ancestor) {
  this.kind = kind;
  this.ancestor = ancestor;
  this.elements = [];
};

Group.prototype.add = function(element) { this.elements.push(element) };

Group.prototype.is = function(kind, ancestor) {
  return this.kind == kind && this.ancestor == ancestor;
};

var ElementGroups = Array.prototype.constructor;

ElementGroups.prototype.add = function(element) {
  var kind = element.attributes.getNamedItem('data-prop').value;
  var parent = element.parentNode;
  var group = this.get(kind, parent) || this.create(kind, parent);
  group.add(element);
};

ElementGroups.prototype.get = function(kind, parent) {
  return this.find(function(g) { if (g.is(kind, parent)) { return g } });
};

ElementGroups.prototype.create = function(kind, parent) {
  var group = new Group(kind, parent);
  this.push(group);
  return group;
};

module.exports = ElementGroups;
