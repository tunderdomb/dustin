var path = require("path")
var dust = require("dustjs-linkedin")
var util = require("./util")
var read = util.read

var origFormatter = dust.optimizers.format
var whiteSpacePreserver = function ( ctx, node ){ return node }
var CWD = process.cwd()

/**
 * Render a previously loaded template string
 * */
dust.renderSource = function( src, context, cb ){
  dust.loadSource(dust.compile(src, src))
  dust.render(src, context, cb)
}

module.exports = function ( options ){
  var TEMPLATE_DIR = options.views || "/"
  var CACHE = !!options.cache
  var WHITESPACE = !!options.whiteSpace

  require("./helpers")(dust, options.helpers)

  dust.onLoad = function ( name, cb ){
    var content = read(path.join(CWD, TEMPLATE_DIR, name + ".dust"))
    if ( !content ) cb(new Error("Template not found '" + name + "'"))
    else cb(null, content)
  }
  dust.optimizers.format = WHITESPACE
    ? whiteSpacePreserver
    : origFormatter

  dust.__express = function ( path, context, cb ){
    // backslashes are stripped by dust when saving to cache,
    // we need to convert them to forward slashes so they are preserved
    path = path.replace(/\\/g, "/").replace(TEMPLATE_DIR, "").replace(/\.dust$/, "")
    dust.render(path, context, function ( err, rendered ){
      // bust internal cache
      if ( !CACHE ) dust.cache = {}
      cb(err, rendered)
    })
  }

  return dust
}