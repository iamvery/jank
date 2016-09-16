function normalize(name) {
  switch(name) {
    case 'class': return 'className';
    default: return name;
  }
}

function attrsToProps(attributes) {
  return Array.prototype.reduce.call(attributes, function(props, attribute) {
    var name = normalize(attribute.name);
    props[name] = attribute.value;
    return props;
  }, {});
}

module.exports = {attrsToProps: attrsToProps, normalize: normalize};
