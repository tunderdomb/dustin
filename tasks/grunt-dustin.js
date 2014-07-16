var async = require("async")
var dustin = require("../lib/dustin")

module.exports = function ( grunt ){

  grunt.registerMultiTask("dustin", "Render dust templates", function (){

    var options = this.options({
      copy: "",
      helpers: "",
      dustinHelpers: true,
      dustHelpers: true,

      render: false,
      compile: false,
      cache: false,

      data: "",
      resolve: "",
      preserveWhiteSpace: true,
      setup: null
    })

    // copy browser dustin
    if ( options.copy ) {
      dustin.copyClientLibs(options.copy, options.resolve, options.dustinHelpers, options.dustHelpers, options.helpers)
      return
    }

    if ( !options.render && !options.compile ) {
      console.log("Nothing to do..")
      return
    }

    var adapter = dustin(options)

    var sources = []
      , concats = {}

    // prepare files for processing
    this.files.forEach(function ( filePair ){
      sources = filePair.src
        .filter(function( src ){
          return grunt.file.exists(src)
        })
        .map(function( src ){
          return {
            concat: !!options.concat,
            src: src,
            dest: filePair.dest
          }
        })
        .concat(sources)
    })

    var done = this.async()
    // process individual templates
    async.eachSeries(sources, function ( file, next ){
      var src = file.src
      var content = grunt.file.read(src)
      if ( options.compile ) {
        adapter.compile(src, content, function ( err, compiled ){
          if ( !err ) {
            if ( file.concat ) {
              concats[file.dest] = concats[file.dest] || []
              concats[file.dest].push(compiled)
            }
            else {
              grunt.file.write(file.dest, compiled)
              console.log("Compiled '%s'", file.dest)
            }
            next()
          }
          else {
            console.warn(err)
            next(err)
          }
        })
      }
      else if ( options.render ) {
        adapter.render(src, content, null, function ( err, rendered ){
          if ( !err ) {
            grunt.file.write(file.dest, rendered)
            console.log("Rendered '%s'", file.dest)
            next()
          }
          else {
            console.warn(err)
            next(err)
          }
        })
      }
      else {
        next(new Error("We shouldn't be here.."))
      }
    }, function ( err ){
      if ( !err ) {
        var dest
          , compiledTemplates
        for( dest in concats ){
          compiledTemplates = concats[dest]
          if ( compiledTemplates.length ) {
            grunt.file.write(dest, compiledTemplates.join(";\n"))
            console.log("Compiled '%s'", dest)
          }
        }
      }
      else{
        console.warn(err)
      }
      done(err || true)
    })
  })
};