/**
 * Export the dust object when used inside browserify
 * */
if ( typeof window != "undefined" && typeof exports != "undefined" ) {
  window.dust = module.exports
}