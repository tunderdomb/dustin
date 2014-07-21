dustin
============

Better templating with LinkedIn's dust fork.

## Install

    npm i dustin --save

## Usage

```js
var dustin = require("dustin")
var adapter = dustin({
  data: "data/*.json",
  resolve: "view/",
  helpers: "helpers/*.js",
  preserveWhiteSpace: true,
  setup: function( adapter, dust ){}
})

```

## API


### adapter.preserveWhiteSpace(preserve)

switch between minified and unformatted rendering

### adapter.loadPartial(name)

load a partial from disk by name
uses the resolve property to construct a path with the current working dir for a dust template.
appends .dust to the name argument.

### adapter.registerHelpers(sources)

Register helpers.

### adapter.data(sources)

Extend the base context with json files.
Each file's contents will be assigned to the base context with its name.

### adapter.render(src, content, context, done)

Render a template with an optional context.
The context will extend the base context object.
It can be a function which can be used to asynchronously acquire a context.
This function has a callback, pass this callback the context as the only argument.

### adapter.compile(src, content, done)

Compile a template.

### adapter.__express(path, context, cb)

This function is bound to the adapter object, and can be passed to
app.engine() in an express application.
For the rendering to work, you should set two options on the application.

```js
var adapter = dustin({
  cache: false,
  preserveWhiteSpace: false,
  helpers: "view/helpers/** /*.js",
  data: "view/data/** /*.json",
  resolve: "view/"
})

app.set("view engine", "dust")
app.set("views", "view/") // the same as the resolve option passed to the adapter
```

## Licence

MIT