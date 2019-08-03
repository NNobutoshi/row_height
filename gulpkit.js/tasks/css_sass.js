const
  gulp       = require( 'gulp' )
  ,gulpIf    = require( 'gulp-if' )
  ,plumber   = require( 'gulp-plumber' )
  ,postcss   = require( 'gulp-postcss' )
  ,sass      = require( 'gulp-sass' )
  ,sourcemap = require( 'gulp-sourcemaps' )

  ,cssMqpacker = require( 'css-mqpacker' )
  ,del         = require( 'del' )

  ,taskName = 'css_sass'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings

  ,options = config.options
;

gulp.task( taskName, gulp.series( _css_clean, () => {
  if ( config.cssMqpack ) {
    options.postcss.plugins.push( cssMqpacker() );
  }
  return gulp
    .src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.init( { loadMaps: true } )
    ) )
    .pipe( sass( options.sass ) )
    .pipe( postcss( options.postcss.plugins ) )
    .pipe( gulpIf(
      config.sourcemap
      ,sourcemap.write( './' )
    ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
} ) )
;

function _css_clean( done ) {
  if ( !config.sourcemap ) {
    return del( options.del.dist, options.del.options );
  } else {
    done();
  }
}
