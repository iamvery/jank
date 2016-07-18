var {expect} = require('./helper');

describe('transformation', () => {
  var {apply, transform} = require('../lib/ratchet/component');
  var {Attribute, Node, Text} = require('./support/dom');

  describe('apply', () => {
    it('applies text data to node directly', () => {
      var node = new Node('div');

      var {tag, props, content, data} = apply(node, 'lolwat');

      expect(tag).to.eql('div');
      expect(props).to.eql({});
      expect(content).to.eql(['lolwat']);
      expect(data).to.eql('lolwat')
    });

    it('applies array data by mapping over node', () => {
      var node = new Node('article');

      var {tag, props, content, data} = apply(node, ['lol', 'wat']);
      var [first, last] = content;

      expect(tag).to.eql('div');
      expect(props).to.eql({});
      expect(data).to.eql(['lol', 'wat']);
      expect(first.tag).to.eql('article');
      expect(first.props).to.eql({});
      expect(first.content).to.eql(['lol']);
      expect(first.data).to.eql('lol');
      expect(last.tag).to.eql('article');
      expect(last.props).to.eql({});
      expect(last.content).to.eql(['wat']);
      expect(last.data).to.eql('wat');
    });

    it('applies other data by recursively creating children', () => {
      var attr = new Attribute('data-prop', 'wat');
      var child = new Node('div', [attr]);
      var node = new Node('div', [], [child]);

      var {tag, props, content, data} = apply(node, {wat: 'hahaha'});

      expect(tag).to.eql('div');
      expect(props).to.eql({});
      expect(data).to.eql({wat: 'hahaha'});
      expect(content[0].tag).to.eql('div');
      expect(content[0].props).to.eql({'data-prop': 'wat'});
      expect(content[0].content).to.eql(['hahaha']);
      expect(content[0].data).to.eql('hahaha');
    });

    it('accepts 3rd argument used as transform for each application', () => {
      var node = new Node('div');

      var [tag, props, content, data] = apply(node, '', ({tag, props, content, data}) => [tag, props, content, data]);

      expect(tag).to.eql('div');
      expect(props).to.eql({});
      expect(content).to.eql(['']);
      expect(data).to.eql('');
    });
  });

  describe('transform', () => {
    context('node is text', () => {
      it('returns text when node is text', () => {
        var node = new Text('foo');

        var result = transform(node);

        expect(result).to.equal('foo');
      });
    });

    context('node is scoped', () => {
      it('applies text content to element', () => {
        var attr = new Attribute('data-prop', 'lol');
        var node = new Node('div', [attr]);
        var data = {lol: 'wat'};

        var {tag, props, content} = transform(node, data);

        expect(tag).to.equal('div')
        expect(props).to.eql({'data-prop': 'lol'});
        expect(content).to.eql(['wat']);
      });
    });

    context('node is not scoped', () => {
      it('recursively transforms elements with data', () => {
        var chattr = new Attribute('data-prop', 'wat');
        var child = new Node('div', [chattr]);
        var node = new Node('div', [], [child]);
        var data = {wat: 'hahaha'};

        var {tag, props, content} = transform(node, data);

        expect(tag).to.equal('div')
        expect(props).to.eql({});
        expect(content[0].tag).to.equal('div');
        expect(content[0].props).to.eql({'data-prop': 'wat'});
        expect(content[0].content).to.eql(['hahaha']);
      });
    });
  });
});
