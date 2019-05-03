import {CustomElement, Attribute} from './bin/dsl.js';

CustomElement({
  name: "my-element",
  templateURL: "./template.html",
  attributes: [
    Attribute({
      name: "disabled",
      changed: (oldV, newV) => {alert(`${oldV} to ${newV}`)}
    })
  ]
});




