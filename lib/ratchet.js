var React = require('react');
var ReactDOM = require('react-dom');

function propObj(attributes) {
  return Array.prototype.reduce.call(attributes, function(props, attribute) {
    var name = attribute.name;
    // TODO extract attr normalization routine
    if (name == 'class') name = 'className';
    props[name] = attribute.value;
    return props;
  }, {});
};

function createChildren(node, data) {
  return Array.prototype.reduce.call(node.childNodes, function(elements, child) {
    // TODO probably need more robust strategy for handling text/other node types
    if (child.attributes === undefined) {
      elements.push(child.wholeText);
      return elements;
    }
    var dataProp = child.attributes['data-prop'];
    var children;
    if (dataProp) { children = [data[dataProp.value]]; }
    else { children = createChildren(child, data); }
    var attrs = propObj(child.attributes);
    var element = React.createElement.apply(undefined, [child.tagName, attrs].concat(children));
    elements.push(element);
    return elements;
  }, []);
}

function DataChannel(socket, property) {
  // this is all specific to phoenix sockets
  var topic = "data:" + property;
  var channel = socket.channel(topic);
  channel.join()
    .receive("ok", function(resp) { console.log("Joined \"" + topic + "\"") })
    .receive("error", function(resp) { console.log("Unable to join \"" + topic + "\"") });
  return channel;
};

function Component(template, name, channel) {
  // traverse dom tree of template
  // - otherwise just create element with properties
  function createComponent(data) {
    var attrs = propObj(template.attributes);
    if (data.id) { attrs.key = data.id }
    var children = createChildren(template, data)
    return React.createElement.apply(undefined, [template.tagName, attrs].concat(children));
  }
  return React.createClass({
    getInitialState: function() {
      return {data: this.props.data};
    },
    componentWillMount: function() {
      channel.on('data', function(payload) {
        this.setState({data: payload[name]});
      });
    },
    render: function() {
      var data = this.state.data;
      if (Array.isArray(data)) {
        return React.createElement('div', null, this.state.data.map(createComponent));
      } else {
        return createComponent(this.state.data);
      }
    }
  });
};

var Ratchet = {
  init: function(opts) {
    var socket = opts.socket;
    var data = opts.data;
    // Note: This will fail as is when no existing data is in the view, because in
    // that case no view will be present at all.
    var components = document.querySelectorAll('[data-component]');
    // assumes all components are adjacent (for now)
    // in the future we'll need to be able to:
    // - group them by common parent and kind
    var grouped = Array.prototype.reduce.call(components, function(groups, comp) {
      var kind = comp.attributes['data-prop'].value;
      groups[kind] = groups[kind] || [];
      groups[kind].push(comp);
      return groups;
    }, {});

    for (var kind in grouped) {
      var elements = grouped[kind];
      var wrapper = document.createElement('div');
      wrapper.id = kind;
      var template = elements[0];
      var channel = DataChannel(socket, kind);
      template.insertAdjacentElement('beforebegin', wrapper);
      elements.forEach(function(post) {
        wrapper.appendChild(post);
      });

      var component = Component(template, kind, channel);

      if (data) {
        ReactDOM.render(React.createElement(component, {data: data[kind]}), wrapper);
      } else {
        var onMessage = channel.onMessage;
        channel.onMessage = function(event, payload, ref) {
          if (event == 'data') {
            console.log("boot");
            ReactDOM.render(React.createElement(component, {data: payload}), wrapper);
            channel.onMessage = onMessage;
          }
          return payload;
        };
      }
    }
  }
};

module.exports = Ratchet;
