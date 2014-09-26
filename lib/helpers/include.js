!function ( f ){
  if ( typeof window != "undefined" ) {
    f(window.dust.helpers, dust)
  }
  else if ( typeof exports != "undefined" ) {
    module.exports = f
  }
}(function ( helpers ){
  var fs = require("fs")
  helpers.include = function ( chunk, context, bodies, params ){
    var src = params.src
    if( !src ) return chunk
    try{
      return chunk.write(fs.readFileSync(src))
    }
    catch( e ){
      console.warn("Couldn't include '"+src+"'")
      return chunk
    }
  }
})