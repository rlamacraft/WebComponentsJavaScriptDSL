# WebComponentsJavaScriptDSL
A declarative embedded DSL for defining Web Components.

When using [Web Components](https://developers.google.com/web/fundamentals/web-components/) there is a substantial amount of boiler-plate code necessary that generally includes most of, it not all, of the following:
*   Defining the class that extends HTMLElement
*   Attaching a Shadow DOM
*   Importing the HTML content from a template file
*   Establishing any attributes that much be observed, settered, gettered, and listened for.
*   Declaraing the new element

Wouldn't it be great if there was some terse syntax for defining the few bits that change, like names and attributes? Wouldn't something like this be better?

```
CustomElement({
  name: "my-element",
  observedAttributes: ["disabled"],
  templateURL: "./template.html"
});
```

To see the full example in action, run
```
npm run-script build
```
Then start a simple HTTP Server in the examples directory e.g.
```
python3 -m http.server 8000
```
