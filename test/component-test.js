var {expect} = require('./helper');

describe('component creation', () => {
  var {apply, createComponent} = require('../lib/ratchet/component');
  var {Attribute, Node, Text} = require('./support/dom');

  describe('apply', () => {
    it('applies text data to node directly', () => {
      var node = new Node('div');

      var {content} = apply(node, 'lolwat');

      expect(content).to.eql(['lolwat']);
    });

    it('applies array data by mapping over node', () => {
      var node = new Node('div');

      var [first, last] = apply(node, ['lol', 'wat']);

      expect(first.content).to.eql(['lol']);
      expect(last.content).to.eql(['wat']);
    });
  });

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
