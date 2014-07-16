dust.helpers.macro = function ( chunk, context, bodies, params ){
  var body = bodies.block
    , partial = params.partial
    , template

  delete params.partial
  context = context.push(params)

  if ( partial ) {
    template = dust.cache[partial]
    if( !template ) {
      console.error("Missing template: '"+partial+"'")
      return chunk
    }
    return template(chunk, context)
  }
  return body ? body(chunk, context) : chunk
}