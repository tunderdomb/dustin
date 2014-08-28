dustin
============

Better templating with LinkedIn's dust fork.

Dustin extends dust with some missing functionality
like cache control and formatting option for white space preservation.

It also provides a convenient express engine (`dust.__express`).
This package also includes [dustjs-helpers](https://github.com/linkedin/dustjs-helpers)
alongside some useful helpers. 

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

### cache

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

### getTemplateNameFromPath(path)

Returns a template name according to the options you passed to dustin

### getTemplatePathFromName(name)

Returns an absolute path concatenated from the cwd,
the template dir you passed to dustin
and the name argument with the .dust extension

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


## Custom helpers

### for

#### Params:

##### $key:

a variable name for the key. defaults to `$key`

##### $value:

a variable for the value. defaults to `$value`

##### $in:

the object to iterate over if not provided `context.current()` will be used

params are prefixed with a `$` so it's less likely they clash with context members

@example

Context

    "ooo": {
      "a": {
        "1": "1"
      },
      "b": {
        "2": "2"
      }
    }

Template

    {@for var="asd" value="qwe" $in=ooo}
     {asd}
     {@for:qwe}
       {$key} - {$value} {~n}
     {/for}
    {/for}

Output

    a1 - 1
    b2 - 2

### include

Embed a file from the file system into the template.

#### Params

##### src

The file's source.

### macro

Render a partial's body with the macro's params (except the partial).

#### Params

##### partial

The template name of a partial

### with

This simply sets the context to the head of the stack.
It helps cutting down on typing accessors.

context

    "someObject": {
     "a": "hello",
     "b": "hi"
    }

template

    {@with:someObject}
      {a}{~n}
      {b}
    {/with}

Output

    hello
    hi


## Client side extended API

### dust.renderElement( template, context, done )

The same as dust.render, but instead of a string it calls `done(err, out)`
with a document fragment.

## Licence

MIT