var {expect} = require('./helper');

describe('FakePhoenixChannel', () => {
  var FakePhoenixChannel = require('./support/fake_phoenix_channel');

  describe('#on', () => {
    it('is invoked when data arrives', (done) => {
      var data = {};
      var channel = new FakePhoenixChannel();

      channel.on('does not matter', (payload) => {
        expect(payload).to.equal(data);
        done();
      });

      channel.synthesize(data);
    });
  });
});
