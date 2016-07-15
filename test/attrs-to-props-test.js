var {expect} = require('./helper');

describe('attrsToProps', () => {
  var attrsToProps = require('../lib/ratchet/attrs-to-props');
  var Attribute = function(name, value) {
    this.name = name;
    this.value = value;
  };

  it('folds collection of attribute nodes into an object of k/v pairs', () => {
    var attrs = [
      new Attribute('foo', 'bar'),
      new Attribute('baz', 'qux'),
    ];

    var props = attrsToProps(attrs);

    expect(props).to.eql({
      foo: 'bar',
      baz: 'qux',
    });
  });

  it('converts names that would be reserved to react-compatible equivalents', () => {
    var attrs = [
      new Attribute('class', 'lolwat'),
    ];

    var props = attrsToProps(attrs);

    expect(props).to.eql({
      className: 'lolwat',
    });
  });
});
