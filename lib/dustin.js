var path = require("path")
var glob = require("glob")

var util = require("./util")
var client = require("./client")

util.extend(dustin, client)

// dustjs helpers
var dust = dustin.dust = require("dustjs-linkedin")
var helpers = require("dustjs-helpers")
dust.helpers = helpers.helpers

registerBuiltInHelpers()

/**
 * @return {Adapter}
 * */
function dustin( setup ){
  return new Adapter(setup)
}

module.exports = dustin

// save original formatter's reference
var origFormatter = dust.optimizers.format

// switch between minified and unformatted rendering
dustin.preserveWhiteSpace = preserveWhiteSpace
function preserveWhiteSpace( preserve ){
  if ( preserve ) {
    dust.optimizers.format = function ( ctx, node ){ return node }
  }
  else {
    dust.optimizers.format = origFormatter
  }
}

/**
 * filename without extension
 * */
function nameOf( src ){
  return path.basename(src, path.extname(src))
}

/**
 * generate a relative template name from a template path and a resolution dir
 * */
function resolveTemplateName( templatePath, resolveDir ){
  return templatePath
    .replace(/\\/g, "/")
    .replace(resolveDir, "")
    .replace(process.cwd().replace(/\\/g, "/"), "")
    .replace(/^\//, "")
    .replace(".dust", "")
}

/**
 * generate an absolute template file path from the current working dir,
 * a resolution dir and a template name.
 * */
function resolveTemplatePath( resolveDir, template ){
  return path.join(process.cwd(), resolveDir, template + ".dust")
}

/**
 * iterate over all built in helper and require them
 * */
function registerBuiltInHelpers(  ){
  glob
    .sync(path.join(__dirname, "helpers/*.js"))
    .map(function ( builtInHelper ){
      return require(builtInHelper)
    })
    .forEach(function ( helperFunction ){
      helperFunction(dustin, dust, dust.helpers)
    })
}

/**
 * Adapter
 * constructor for a template object
 * */
function Adapter( options ){
  options = options || {}
  var adapter = this

  this.resolve = options.resolve || ""
  this.cache = !!options.cache
  this.whiteSpace = !!options.preserveWhiteSpace

  this.context = {
    __adapter: this
  }
  this.partials = {}
  // keep track of the current root template for error reporting
  this.currentDustTemplate = null
  this.__express = this.__express.bind(this)

  if ( options.helpers ) this.registerHelpers(options.helpers)
  if ( options.data ) this.data(options.data)

  // By default Dust returns a "template not found" error
  // when a named template cannot be located in the cache.
  // Override onLoad to specify a fallback loading mechanism
  // (e.g., to load templates from the filesystem or a database).
  dust.onLoad = function ( name, cb ){
    cb(null, adapter.loadPartial(name))
  }
  options.setup && options.setup(this, dust)
}

/**
 * switch between minified and unformatted rendering
 * */
Adapter.prototype.preserveWhiteSpace = function ( preserve ){
  dustin.preserveWhiteSpace(preserve)
  return this
}

/**
 * load a partial from disk by name
 * uses the resolve property to construct a path with the current working dir for a dust template.
 * appends .dust to the name argument.
 * @param name{String} the name of a dust template relative to `this.resolve` path.
 * */
Adapter.prototype.loadPartial = function ( name ){
  var partial = this.partials[name]
  var content
  if ( !this.cache || !partial ) {
    var src = resolveTemplatePath(this.resolve, name)
    content = util.read(src)
    if ( this.cache && partial ) {
      this.partials[name] = {
        src: src,
        name: name,
        content: content
      }
    }
  }
  else {
    content = partial && partial.content
  }
  if ( !content ) {
    throw new Error("Partial '" + name + "' not found in '" + this.currentDustTemplate + "'")
  }
  return content
}

/**
 * @param sources{String|String[]} .js file paths
 * */
Adapter.prototype.registerHelpers = function ( sources ){
  var adapter = this
  if ( typeof sources == "string" ) {
    sources = glob.sync(sources)
  }
  sources.forEach(function ( src ){
    src = path.join(process.cwd(), src)
    try {
      require(src)(adapter, dustin, dust)
    }
    catch ( e ) {
      console.error("Couldn't load helper '" + src + "'", e)
    }
  })
}

/**
 * @param sources{String|String[]} .json file paths
 * */
Adapter.prototype.data = function ( sources ){
  var context = this.context
  if ( typeof sources == "string" ) {
    sources = glob.sync(sources)
  }
  sources.forEach(function ( file ){
    try {
      context[nameOf(file)] = JSON.parse(util.read(file))
    }
    catch ( e ) {
      console.warn("Invalid data path: '" + file + "'")
    }
  })
}

/**
 * @param src{String} The path of a template file
 * @param [content]{String} The content of the template file.
 * @param context{Object|Function} Rendering context, or a callback to get a context.
 * @param done{Function} End callback receiving an error and the output as arguments.
 * */
Adapter.prototype.render = function ( src, content, context, done ){
  var adapter = this

  if ( typeof context == "function" ) {
    context(function( ctx ){
      adapter.render(src, content, ctx, done)
    })
    return
  }

  context = context
    ? util.merge(adapter.context, context)
    : adapter.context

  var name = resolveTemplateName(src, this.resolve)

  try {
    // resetting whitespace preservation on each render call
    // because it can't be set on a per render basis
    preserveWhiteSpace(adapter.whiteSpace)
    adapter.currentDustTemplate = src
    if ( content ) {
      dust.loadSource(dust.compile(content, name))
    }
    dust.render(name, context, function ( err, rendered ){
      // clear dust cache each time a root template is rendered
      // because there's no other way r/n to disable caching
      if ( !adapter.cache ) {
        dust.cache = {}
      }
      delete adapter.currentDustTemplate
      done(err, rendered)
    })
  }
  catch ( e ) {
    if ( !adapter.cache ) {
      dust.cache = {}
    }
    delete adapter.currentDustTemplate
    done(e)
  }
}

/**
 * @param src{String} The path of a template file
 * @param [content]{String} The content of the template file.
 * @param done{Function} End callback receiving null and the output as arguments.
 * */
Adapter.prototype.compile = function ( src, content, done ){
  try {
    // resetting whitespace preservation on each render call
    // because it can't be set on a per render basis
    preserveWhiteSpace(this.whiteSpace)
    var name = resolveTemplateName(src, this.resolve)
    var compiled = dust.compile(content, name)
    done(null, compiled)
  }
  catch ( e ) {
    done(e)
  }
}

/**
 * This function is bound to the adapter object, and can be passed to
 * app.engine() in an express application.
 * For the rendering to work, you should set two options on the application.
 *
 * app.set("view engine", "dust")
 * app.set("views", "<the same as the resolve option passed to the adapter>")
 *
 * @example
 *

 var adapter = dustin({
  cache: false,
  preserveWhiteSpace: false,
  helpers: "view/helpers/** /*.js",
  data: "view/data/** /*.json",
  resolve: "view/"
})

 app.set("view engine", "dust")
 app.set("views", "view/")

 * */
Adapter.prototype.__express = function ( path, context, cb ){
  this.render(path, null, context, cb)
}