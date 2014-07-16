module.exports = function ( adapter, dustin, dust ){
  dust.helpers.macro = function ( chunk, context, bodies, params ){
    var body = bodies.block
      , partial = params.partial
      , template

    delete params.partial
    context = context.push(params)

    if ( partial ) {
      template = dust.cache[partial]
      if( !template ) {
        template = adapter.loadPartial(partial)
        template = dust.compile(template, partial)
        dust.loadSource(template)
        template = dust.cache[partial]
      }
      return template(chunk, context)
    }

    return body ? body(chunk, context) : chunk
  }
}