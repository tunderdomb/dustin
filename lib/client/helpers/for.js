dust.helpers["for"] = function ( chunk, context, bodies, params ){
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
