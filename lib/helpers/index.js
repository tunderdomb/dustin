var glob = require("glob")
var helpers = ["for", "include", "dustjs-helpers", "macro", "with"]

module.exports = function( dust, userHelpers ){
  helpers.forEach(function( helper ){
    require("./"+helper)(dust.helpers, dust)
  })
  if ( userHelpers ) {
    glob.sync(userHelpers).map(function( helper ){
      require(helper)(dust.helpers, dust)
    })
  }
}