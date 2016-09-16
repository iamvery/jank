var equal = require('array-equal');

var Group = function(topic, ancestor) {
  this.topic = topic;
  this.ancestor = ancestor;
  this.elements = [];
};

Group.prototype.add = function(element) { this.elements.push(element) };

Group.prototype.is = function(topic, ancestor) {
  return this.topic == topic && this.ancestor == ancestor;
};

var ElementGroups = Array.prototype.constructor;

ElementGroups.prototype.add = function(element) {
  var topic = element.attributes.getNamedItem('data-topic').value;
  var parent = element.parentNode;
  var group = this.get(topic, parent) || this.create(topic, parent);
  group.add(element);
};

ElementGroups.prototype.get = function(topic, parent) {
  return this.find(function(g) { if (g.is(topic, parent)) { return g } });
};

ElementGroups.prototype.create = function(topic, parent) {
  var group = new Group(topic, parent);
  this.push(group);
  return group;
};

module.exports = ElementGroups;
