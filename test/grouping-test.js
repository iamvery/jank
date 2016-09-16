var {expect} = require('./helper');

describe('grouping', () => {
  var ElementGroups = require('../lib/jank/grouping');
  var {Attribute, Node} = require('./support/dom');

  describe('#add', () => {
    it('groups nodes by their kind and parent', () => {
      var parent1 = new Node();
      var parent2 = new Node();
      var attr = new Attribute('data-prop', 'lol');
      var node1 = new Node('div', [attr]);
      node1.parentNode = parent1;
      var node2 = new Node('div', [attr]);
      node2.parentNode = parent2;

      var groups = new ElementGroups();
      groups.add(node1);
      groups.add(node1);
      groups.add(node2);

      expect(groups.length).to.eql(2);

      expect(groups[0].kind).to.eql('lol');
      expect(groups[0].elements).to.eql([node1, node1]);
      expect(groups[1].kind).to.eql('lol');
      expect(groups[1].elements).to.eql([node2]);
    });
  });
});
