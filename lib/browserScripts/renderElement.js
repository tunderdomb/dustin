!function ( dust ){
  dust.renderElement = function ( template, context, done ){
    dust.render(template, context, function ( err, rendered ){
      if ( err ) done(err)
      else {
        var div = document.createElement("div")
        div.innerHTML = rendered
        var fragment = document.createDocumentFragment()
        while ( div.childNodes.length ) {
          fragment.appendChild(div.childNodes[0])
        }
        done(null, fragment)
        div = fragment = null
      }
    })
  }
//}(typeof exports === 'object' ? module.exports : this.dust)
}(typeof window != "undefined" ? window.dust : typeof exports != undefined ? module.exports : this.dust)