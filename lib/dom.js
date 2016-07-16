function traverse(node, callback) {
  var children = Array.prototype.map.call(node.childNodes, (child) => traverse(child, callback));
  return callback(node, children);
}

module.exports = {traverse};
