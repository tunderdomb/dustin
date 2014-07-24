dust.helpers["with"] = function ( chunk, context, bodies, params ){
  var body = bodies.block
  if ( body ) {
    chunk = body(chunk, context.push(context.current()))
  }
  return chunk
}
