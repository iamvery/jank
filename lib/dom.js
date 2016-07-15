function traverse(node, callback) {
  var children = node.childNodes.map((child) => traverse(child, callback));
  return callback(node, children);
}

module.exports = {traverse};
