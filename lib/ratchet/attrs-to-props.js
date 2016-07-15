function propObj(attributes) {
  return Array.prototype.reduce.call(attributes, function(props, attribute) {
    var name = attribute.name;
    // TODO extract attr normalization routine
    if (name == 'class') name = 'className';
    props[name] = attribute.value;
    return props;
  }, {});
}

module.exports = propObj;
