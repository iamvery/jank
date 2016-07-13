let React = require('react');
let ReactDOM = require('react-dom');

function propObj(attributes) {
  return Array.prototype.reduce.call(attributes, (props, attribute) => {
    props[attribute.name] = attribute.value;
    return props;
  }, {});
};

function createChildren(node, data) {
  return Array.prototype.reduce.call(node.childNodes, (elements, child) => {
    // TODO probably need more robust strategy for handling text/other node types
    if (child.attributes === undefined) {
      elements.push(child.wholeText);
      return elements;
    }
    let dataProp = child.attributes['data-prop'];
    let children;
    if (dataProp) { children = [data[dataProp.value]]; }
    else { children = createChildren(child, data); }
    let attrs = propObj(child.attributes);
    let element = React.createElement(child.tagName, attrs, ...children);
    elements.push(element);
    return elements;
  }, []);
}

function DataChannel(socket, property) {
  // this is all specific to phoenix sockets
  let topic = `data:${property}`;
  let channel = socket.channel(topic);
  channel.join()
    .receive("ok", resp => { console.log(`Joined "${topic}"`) })
    .receive("error", resp => { console.log(`Unable to join "${topic}"`) });
  return channel;
};

function Component(template, name, channel) {
  // traverse dom tree of template
  // - otherwise just create element with properties
  function createComponent(data) {
    let attrs = propObj(template.attributes);
    if (data.id) { attrs.key = data.id }
    let children = createChildren(template, data)
    return React.createElement(template.tagName, attrs, ...children);
  }
  return React.createClass({
    getInitialState: function() {
      return {data: this.props.data};
    },
    componentWillMount: function() {
      channel.on('data', payload => {
        this.setState({data: payload[name]});
      });
    },
    render: function() {
      let data = this.state.data;
      if (Array.isArray(data)) {
        return React.createElement('div', null, this.state.data.map(createComponent));
      } else {
        return createComponent(this.state.data);
      }
    }
  });
};

let Ratchet = {
  init: function(socket) {
    // Note: This will fail as is when no existing data is in the view, because in
    // that case no view will be present at all.
    let components = document.querySelectorAll('[data-component]');
    // assumes all components are adjacent (for now)
    // in the future we'll need to be able to:
    // - group them by common parent and kind
    let grouped = Array.prototype.reduce.call(components, (groups, comp) => {
      let kind = comp.attributes['data-prop'].value;
      groups[kind] = groups[kind] || [];
      groups[kind].push(comp);
      return groups;
    }, {});

    for (let kind in grouped) {
      let elements = grouped[kind];
      let wrapper = document.createElement('div');
      wrapper.id = kind;
      let template = elements[0];
      let channel = DataChannel(socket, kind);
      template.insertAdjacentElement('beforebegin', wrapper);
      elements.forEach(post => {
        wrapper.appendChild(post);
      });

      let component = Component(template, kind, channel);

      let onMessage = channel.onMessage;
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
};

let Socket = require('phoenix').Socket;
let socket = new Socket('/data');
socket.connect();
Ratchet.init(socket);
