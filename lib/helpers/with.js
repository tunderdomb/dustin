!function ( f ){
  if ( typeof window != "undefined" ) {
    f(window.dust.helpers, dust)
  }
  else if ( typeof exports != "undefined" ) {
    module.exports = f
  }
}(function ( helpers ){

  /**
   * This simply sets the context to the head of the stack.
   * It helps cutting down on typing accessors.
   *
   * @example
   *
   * "someObject": {
   *  "a": "hello",
   *  "b": "hi"
   * }
   * {@with:someObject}
   *   {a}{~n}
   *   {b}
   * {/with}
   *
   * Output
   * hello
   * hi
   *
   * */
  helpers["with"] = function ( chunk, context, bodies, params ){
    var body = bodies.block
    if ( body ) {
      chunk = body(chunk, context.push(context.current()))
    }
    return chunk
  }
})