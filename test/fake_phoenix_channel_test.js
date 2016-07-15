var {expect} = require('./helper');

describe('FakePhoenixChannel', () => {
  var FakePhoenixChannel = require('./support/fake_phoenix_channel');

  describe('#synthesize', () => {
    it('manually invokes callback with provided data', (done) => {
      var data = {};
      var channel = new FakePhoenixChannel();

      channel.on('does not matter', (payload) => {
        expect(payload).to.equal(data);
        done()
      });

      channel.synthesize(data);
    });
  });
});
