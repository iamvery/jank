var {expect} = require('./helper');

describe('FakePhoenixChannel', () => {
  var FakePhoenixChannel = require('./support/fake_phoenix_channel');
  var channel;

  beforeEach(() => {
    channel = new FakePhoenixChannel();
  });

  describe('#on', () => {
    it('is invoked when data arrives', (done) => {
      var data = {};

      channel.on('does not matter', (payload) => {
        expect(payload).to.equal(data);
        done();
      });

      channel.synthesize(data);
    });
  });

  describe('onMessage', () => {
    it('is invoked anytime data data arrives', (done) => {
      var data = {};

      channel.onMessage = function(_event, payload) {
        expect(payload).to.equal(data);
        done();
      };

      channel.synthesize(data);
    });
  });
});
