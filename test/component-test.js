var {expect} = require('./helper');

describe('component creation', () => {
  var {createComponent} = require('../lib/ratchet/component');
  var {Attribute, Node, Text} = require('./support/dom');

  describe('createComponent', () => {
    context('node is text', () => {
      it('returns text when node is text', () => {
        var node = new Text('foo');

        var result = createComponent(node);

        expect(result).to.equal('foo');
      });
    });

    context('node is scoped', () => {
      it('applies text content to element');
      it('recursively creates elements with scoped data');
    });

    context('node is not scoped', () => {
      it('recursively creates elements with data');
    });
  });
});
