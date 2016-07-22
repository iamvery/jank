var {Ratchet} = require('../index.js');

var data = {
  counter: {count: "123"},
  count: "456",
  post: [
    {id: 1, title: "foo", body: "bar"},
    {id: 2, title: "stuff", body: "things"},
  ],
};

var fake = {data: ()=>{}};
var channelInit = () => fake;

Ratchet.init({data, channelInit});
