!function ( f ){
  if ( typeof module != undefined && module.exports ) module.exports = f
  else f(dust, dust.helpers)
}(function ( helpers ){
  helpers.macro = function ( chunk, context, bodies, params ){
    var body = bodies.block
      , partial = params.partial
      , template

    delete params.partial
    context = context.push(params)

    if ( partial ) {
      template = dust.cache[partial]
      if ( template ) {
        return template(chunk, context)
      }
      else {
        dust.onLoad(partial, function ( err, template ){
          template = dust.compile(template, partial)
          dust.loadSource(template)
          template = dust.cache[partial]
          template(chunk, context)
        })
        return chunk
      }
    }
    return body ? body(chunk, context) : chunk
  }
})