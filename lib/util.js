var fs = require("fs")
var util = module.exports = {}

/**
 * Read a file from the filesystem.
 * @param src{String} file path
 * @return String|null
 * */
util.read = function read( src ){
  try {
    return fs.readFileSync(src, "utf8")
  }
  catch ( e ) {
    return null
  }
}

/**
 * Extend an object with another's properties.
 * @param obj{Object} original object to extend
 * @param extension{Object} object with extension properties
 * @return Object obj the extended object
 * */
util.extend = function extend( obj, extension ){
  for ( var prop in extension ) {
    obj[prop] = extension[prop]
  }
  return obj
}

/**
 * Merge two objects leaving both intact.
 * @param obj{Object} this object will be cloned
 * @param extension{Object} this object will overwrite existing properties, extending the clone
 * @return Object a brand new object with merged values
 * */
util.merge = function merge( obj, extension ){
  var ret = {}
    , prop
  for ( prop in obj ) {
    ret[prop] = obj[prop]
  }
  for ( prop in extension ) {
    ret[prop] = extension[prop]
  }
  return ret
}
