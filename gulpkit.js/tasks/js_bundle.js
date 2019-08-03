const
  gulp       = require( 'gulp' )
  ,duration  = require( 'gulp-duration' )
  ,gulpIf    = require( 'gulp-if' )
  ,sourcemap = require( 'gulp-sourcemaps' )
  ,tap       = require( 'gulp-tap' )
  ,uglify    = require( 'gulp-uglify' )

  ,browserify = require( 'browserify' )
  ,del        = require( 'del' )
  ,buffer     = require( 'vinyl-buffer' )
  ,source     = require( 'vinyl-source-stream' )
  ,watchify   = require( 'watchify' )

  ,taskName = 'js_bundle'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings

  ,options = config.options
;

gulp.task( taskName, gulp.series( _js_clean, ( cb ) => {
  let
    stream
  ;
  options.browserify.debug = config.sourcemap;
  stream = gulp
    .src( config.src )
    .pipe( tap( function( file ) {
      const
        br = watchify( browserify( file.path, options.browserify ), options.watchify )
      ;
      function _bundle() {
        return br
          .bundle()
          .on( 'error', ( error ) => {
            options.errorHandler( error );
          } )
          .pipe( source( file.relative.replace( /\.bundle\.js$/, '.js' ) ) )
          .pipe( duration( `built "${file.path}"` ) )
          .pipe( buffer() )
          .pipe( gulpIf(
            config.sourcemap
            ,sourcemap.init( { loadMaps: true } )
          ) )
          .pipe( gulpIf(
            config.uglify
            ,uglify( options.uglify )
          ) )
          .pipe( gulpIf(
            config.sourcemap
            ,sourcemap.write( './' )
          ) )
          .pipe( gulp.dest( settings.dist ) )
        ;
      }
      br.on( 'update', _bundle );
      _bundle();
      cb();
    } ) )
  ;
  return stream;
} ) )
;

function _js_clean( done ) {
  if ( !config.sourcemap ) {
    return del( options.del.dist, options.del.options );
  } else {
    done();
  }
}
