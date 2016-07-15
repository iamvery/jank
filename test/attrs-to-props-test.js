var {expect} = require('./helper');

describe('attrsToProps', () => {
  var attrsToProps = require('../lib/ratchet/attrs-to-props');

  it('folds collection of attribute nodes into an object of k/v pairs', () => {
    var attrs = [
      {name: 'foo', value: 'bar'},
      {name: 'baz', value: 'qux'},
    ];

    var props = attrsToProps(attrs);

    expect(props).to.eql({
      foo: 'bar',
      baz: 'qux',
    });
  });

  it('converts names that would be reserved to react-compatible equivalents', () => {
    var attrs = [
      {name: 'class', value: 'lolwat'},
    ];

    var props = attrsToProps(attrs);

    expect(props).to.eql({
      className: 'lolwat',
    });
  });
});
