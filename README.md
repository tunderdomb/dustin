dustin
============

Better templating with LinkedIn's dust fork.

## Install

    npm i dustin --save

## Usage

```js
var dustin = require("dustin")
var dust = dustin({
  cache: true,
  views: "/",
  helpers: "helpers/*.js",
  whiteSpace: true
})
```

#### cache

If false, every `dust.render()` will purge the cache.
It is especially useful for development, when changes to a template should be
reflected in the browser on reload.

### views

Partials will resolve to this folder.
It helps so you don't have to write full template paths all the time.

### helpers

A glob pattern for user helpers to extend the `dust.helpers` object.

A helper should export a function with one or two arguments:

```js
module.exports = function( helpers, dust ){
  helpers.something = function(chunk, context, bodies, params){}
}
```

## extended API

### dust.renderSource( src, context, cb )

Same as render, but instead of loading a template by name
it renders a template string with context.

### dust.__express

An express engine.

Hook it to express like this:

```js
var dustin = require("dustin")
var engine = dustin({
  cache: false,
  views: "app/views",
  helpers: "app/helpers/*.js",
  whiteSpace: true
})
app.engine("dust", engine.__express)
app.set("view engine", "dust")
app.set("views", "app/views")
app.set("view cache", false)
```

## Copy client libraries

```js
var dustin = require("dustin")
dustin.client("destination folder", "resolve path", {
     dust: true,
     user: "",
     custom: ""
   })
```

### destination
Client side scripts will be copied here.

### resolve path
Client templates are loaded like this:

```js
script.src = template[0] == "/" || /^https?:/.test(template)
  ? template
  : ("RESOLVE_PATH"+"/"+template+".js").replace(/\/+/g, "/")
```

Set the resolve path to a template root.


## Client side extended API

### dust.renderElement( template, context, done )

The same as dust.render, but instead of a string it calls `done(err, out)`
with a document fragment.

## Licence

MIT