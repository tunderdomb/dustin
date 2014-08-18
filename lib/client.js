var path = require("path")
var fs = require("fs")
var mkdirp = require("mkdirp")
var glob = require("glob")

var util = require("./util")

// dist client libs
var dustLibs = [
  "dust-core.js",
  "dust-core.min.js",
  "dust-full.js",
  "dust-full.min.js"
]

var ignoreFromClient =[
  "index.js",
  "include.js",
  "dustjs-helpers.js"
]

module.exports = client

/**
 * Copy all dist files from the dust repo to the destination
 * and concat the onLoad function to each them.
 * @example
   client("", "", {
     dust: true,
     user: "",
     custom: ""
   })
 * */
function client( dest, resolvePath, helpers ){
  var nativeHelpers = false
    , dustHelpers = false
    , userHelpers = false
  if ( helpers == true ) {
    nativeHelpers = dustHelpers = true
  }
  else if ( helpers ) {
    nativeHelpers = helpers.custom
    userHelpers = helpers.user
    dustHelpers = helpers.dust
  }
  var clientScript = createClientLibs(resolvePath, nativeHelpers, dustHelpers, userHelpers)
  // append it to each version of dust libs.
  dustLibs.forEach(function doCopy( dustScript ){
    var destPath = path.join(process.cwd(), dest, dustScript)
    var clientPath = path.join(__dirname, "../node_modules/dustjs-linkedin/dist", dustScript)
    var script = ""
      + util.read(clientPath).replace(/[\s\n]*$/, "")
      + ";\n"
      + clientScript
    mkdirp.sync(path.dirname(destPath))
    fs.writeFileSync(destPath, script, "utf8")
  })
}

function createClientLibs( resolvePath, dustinHelpers, dustHelpers, userHelpers ){
  return ""
    // append dust helpers
    + (dustHelpers ? getDustHelpers() : "")
    // append helpers
    + (dustinHelpers ? getDustinHelpers() : "")
    // append user helpers
    + (userHelpers ? getUserHelpers(userHelpers) : "")
    // append custom dustin methods
    + getDustinMethods(resolvePath)
}

function getDustHelpers(){
  return "/* Dust Helpers */\n"
    + fs.readFileSync(path.join(__dirname, "helpers/dustjs-helpers.js"))
    + "\n"
}

function getDustinHelpers(){
  return "/* Dustin Helpers */\n"
    + glob
    .sync(path.join(__dirname, "helpers/*.js"))
    .filter(function ( fileName ){
      return !~ignoreFromClient.indexOf(path.basename(fileName))
    })
    .map(util.read)
    .join(";\n")
    + "\n"
}

function getUserHelpers( globSrc ){
  return "/* User Helpers */\n"
    + glob.sync(path.join(process.cwd(), globSrc)).map(util.read).join(";\n")
    + "\n"
}

function getDustinMethods( resolvePath ){
  return "/* Dustin functions */\n"
    + glob
    .sync(path.join(__dirname, "clientScripts/*.js"))
    .map(util.read)
    .join(";\n")
    .replace(/"RESOLVE_PATH"/, '"' + resolvePath + '"')
    + "\n"
}