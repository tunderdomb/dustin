var fs = require("fs")
module.exports = function ( adapter, dustin, dust ){
  dust.helpers.include = function ( chunk, context, bodies, params ){
    var src = params.src
    if( !src ) return chunk
    return chunk.write(fs.readFileSync(src))
  }
}