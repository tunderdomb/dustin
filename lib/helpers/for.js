!function ( f ){
  if( typeof module != undefined  && module.exports ) module.exports = f
  else f(dust, dust.helpers)
}(function ( helpers ){
  /**
   *
   * Params:
   *
   * $key: a variable name for the key. defaults to `$key`
   * $value: a variable for the value. defaults to `$value`
   * $in: the object to iterate over if not provided `context.current()` will be used
   *
   * params are prefixed with a `$` so it's less likely they clash with context members
   *
   * @example
   *
   * Context
   *
   * "ooo": {
   *  "a": {
   *    "1": "1"
   *  },
   *  "b": {
   *    "2": "2"
   *  }
   * }
   *
   * Template
   *
   * {@for var="asd" value="qwe" $in=ooo}
   *   {asd}
   *   {@for:qwe}
   *     {$key} - {$value} {~n}
   *   {/for}
   * {/for}
   *
   * Output
   *
   * a1 - 1
   * b2 - 2
   * */
  helpers["for"] = function ( chunk, context, bodies, params ){
    params = params || {}
    var obj = params["$in"] || context.current()
      , keyVar = params["$key"] || "$key"
      , valueVar = params["$value"] || "$value"
      , body = bodies.block
      , key
      , value
      , contextObj

    if ( obj && body ) {
      for ( key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
          value = obj[key]
          contextObj = {}
          contextObj[keyVar] = key
          contextObj[valueVar] = value
          contextObj.type = typeof value
          chunk = body(chunk, context.push(contextObj))
        }
      }
    }

    return chunk
  }
})