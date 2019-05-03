class MissingRequiredCustomElementPropertyError extends Error {
  constructor(argName) {
    super();
    this.name = `Missing required property of custom element: ${argName}.`;
  }
}

class InvalidTemplateFileError extends Error {
  constructor(url, reason) {
    super();
    this.name = `Invalid template file '${url}'`;
    this.message = reason;
  }
}

class MissingRequiredAttributePropertyError extends Error {
  constructor(argName) {
    super();
    this.name = `Missing required property of attribute: ${argName}.`;
  }
}

async function fetchHTML(url) {
  const res = await fetch(url);
  const html = await res.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

async function attachTemplate(shadowRoot, templateURL) {
  const html = await fetchHTML(templateURL);
  const templates = html.getElementsByTagName('template');
  if(templates.length === 0) {
    return Promise.reject('No templates found.');
  } else if(templates.length > 1) {
    return Promise.reject('Multiple templates found.');
  } else {
    shadowRoot.appendChild(document.importNode(templates[0].content, true));
  }
  return shadowRoot;
}

class AttributeClass {

  constructor(options) {
    this._name = options.name;
    this._changed = options.changed;
  }

  get name() {
    return this._name;
  }

  get changed() {
    return this._changed;
  }

}

export function Attribute(options = {}) {

  const {
    name,
    changed = () => {}
  } = options;

  if(typeof(name) === 'undefined') {
    throw new MissingRequiredAttributePropertyError('name');
  }

  return new AttributeClass({
    name,
    changed
  });

}

export function CustomElement(options = {}) {

  const {
    name,
    attributes = [],
    templateURL
  } = options;

  if(typeof(name) === 'undefined') {
    throw new MissingRequiredCustomElementPropertyError('name');
  }

  if(typeof(templateURL) === 'undefined') {
    throw new MissingRequiredCustomElementPropertyError('templateURL');
  }

  customElements.define(name, class extends HTMLElement {

    constructor() {
      super();

      const shadowRoot = this.attachShadow({mode: 'open'});
      attachTemplate(shadowRoot, templateURL).catch(e => {
        console.error(new InvalidTemplateFileError(templateURL, e));
      });
    }

    static get observedAttributes() {
      return attributes.map(a => a.name);
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      attributes
        .filter(a => a.name === attrName)
        .map(a => a.changed(oldValue, newValue));
    }

  });


}