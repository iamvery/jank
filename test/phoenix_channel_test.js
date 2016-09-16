var {expect} = require('./helper');

describe('Phoenix adapter', () => {
  var FakePhoenixChannel = require('./support/fake_phoenix_channel');
  var PhoenixAdapter = require('../lib/jank/adapters/phoenix');
  var channel, adapter;

  beforeEach(() => {
    channel = new FakePhoenixChannel();
    adapter = new PhoenixAdapter(channel);
  });

  describe('#data', () => {
    it('registers a callback to be invoked when data happens', (done) => {
      var data = {};

      adapter.data((payload) => {
        expect(payload).to.equal(data);
        done();
      });

      channel.synthesize(data);
    });
  });

  describe('#init', () => {
    it('is invoked on first data', (done) => {
      var data = {};
      adapter.init((payload) => {
        expect(payload).to.equal(data);
        done()
      });

      channel.synthesize(data);
    });

    it('invokes all callbacks', (done) => {
      var count = 0;
      adapter.init(() => {
        count++;
      });

      adapter.init(() => {
        count++;
        done();
      });

      channel.synthesize();

      expect(count).to.eql(2);
    });

    it('is only invoked once', (done) => {
      adapter.init(() => {
        done() // fails if done is called more than once
      });

      channel.synthesize();
      channel.synthesize();
    });
  });
});
