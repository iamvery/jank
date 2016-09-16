var {expect} = require('./helper');
var {Attribute} = require('./support/dom');
var {attrsToProps} = require('../lib/jank/attrs-to-props');

describe('attrsToProps', () => {
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
