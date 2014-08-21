var glob = require("glob")
var path = require("path")

module.exports = function( dust, userHelpers ){
  glob.sync(__dirname+"/*.js").forEach(function( helper ){
    helper = path.basename(helper, path.extname(helper))
    if( helper == "index" ) return
    helper = require("./"+helper)
    if( typeof helper == "function" ) helper(dust.helpers, dust)
  })
  if ( userHelpers ) {
    glob.sync(userHelpers).map(function( helper ){
      require(helper)(dust.helpers, dust)
    })
  }
}