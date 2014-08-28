!function ( dust ){
  dust.onLoad = function ( template, done ){
    var script = document.createElement("script")
    script.src = template[0] == "/" || /^(https?:)?\/\//.test(template)
      ? template
      : ("RESOLVE_PATH" + "/" + template + ".js").replace(/\/+/g, "/")
    script.async = false
    document.head.appendChild(script)
    var ok
      , error = null
    script.onload = function ( e ){
      ok || done(error)
      ok = true
      script.onload = null
      script.onerror = null
    }
    script.onerror = function ( e ){
      ok || done(error = e)
      ok = true
      script.onload = null
      script.onerror = null
    }
  }
}(typeof exports === 'object' ? module.exports : this.dust)
