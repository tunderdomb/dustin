var path = require("path")
var dust = require("dustjs-linkedin")
var util = require("./util")
var read = util.read

var origFormatter = dust.optimizers.format
var whiteSpacePreserver = function ( ctx, node ){ return node }
var CWD = process.cwd()
var normalizedCwd = CWD.replace(/\\/g, "/")

module.exports = function ( options ){
  var TEMPLATE_DIR = options.views || "/"
  var TEMPLATE_DIR_REGEXP = new RegExp("^"+TEMPLATE_DIR)
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

  dust.getTemplateNameFromPath = function ( path ){
    return path
      .replace(/\\/g, "/")
      .replace(normalizedCwd, "")
      .replace(TEMPLATE_DIR, "")
      .replace(/^\/|\.dust$/g, "")
  }

  dust.getTemplatePathFromName = function ( name ){
    return path.join(CWD, TEMPLATE_DIR, name + ".dust")
  }

  dust.__express = function ( path, context, cb ){
    // backslashes are stripped by dust when saving to cache,
    // we need to convert them to forward slashes so they are preserved
    path = path.replace(/\\/g, "/").replace(TEMPLATE_DIR_REGEXP, "").replace(/\.dust$/, "")
    dust.render(path, context, function ( err, rendered ){
      // bust internal cache
      if ( !CACHE ) dust.cache = {}
      cb(err, rendered)
    })
  }

  return dust
}