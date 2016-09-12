var {Jank} = require('../index.js');

var data = {
  counter: {count: "123"},
  count: {content: "456", attrs: {_attrs_: true, className: "wat"}},
  // TODO handle class -> className etc. conversion
  post: [
    {id: 1, title: "foo", body: "bar"},
    {id: 2, title: "stuff", body: "things"},
  ],
};

var fake = {data: ()=>{}};
var channelInit = () => fake;

Jank.init({data, channelInit});
