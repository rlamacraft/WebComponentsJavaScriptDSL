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

export function CustomElement(options = {}) {

  const {
    name,
    observedAttributes = [],
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

      this.addEventListener('click', e => {
        alert('foo');
      });
    }

    static get observedAttributes() {
      return observedAttributes;
    }

  });


}