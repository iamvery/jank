var {expect} = require('./helper');

describe('DOM', () => {
  var {traverse} = require('../lib/dom');
  var Node = function(children) {
    this.childNodes = children || [];
  };

  describe('.traverse', () => {
    it('invokes the callback with each element of the DOM', () => {
      var child1 = new Node();
      var child2 = new Node();
      var node = new Node([child1, child2]);
      var count = 0;

      traverse(node, () => ++count);

      expect(count).to.equal(3);
    });

    it('returns results of callback', () => {
      var child1 = new Node();
      var child2 = new Node();
      var node = new Node([child1, child2]);

      var result = traverse(node, (n,c) => {
        return {node: n, children: c}
      });

      expect(result).to.eql({
        node: node,
        children: [
          {node: child1, children: []},
          {node: child2, children: []},
        ],
      });
    });
  });
});
