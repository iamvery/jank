var {expect} = require('./helper');

describe('Phoenix adapter', () => {
  var FakePhoenixChannel = require('./support/fake_phoenix_channel');
  var PhoenixAdapter = require('../lib/ratchet/adapters/phoenix');

  describe('#data', () => {
    it('registers a callback to be invoked when data happens', (done) => {
      var data = {};
      var channel = new FakePhoenixChannel();
      var adapter = new PhoenixAdapter(channel);

      adapter.data((payload) => {
        expect(payload).to.equal(data);
        done();
      });

      channel.synthesize(data);
    });
  });
});
