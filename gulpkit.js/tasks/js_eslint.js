const
  gulp     = require( 'gulp' )
  ,eSLint  = require( 'gulp-eslint' )
  ,plumber = require( 'gulp-plumber' )

  ,taskName = 'js_eslint'

  ,config = require( '../config.js' ).config[ taskName ]

  ,options = config.options
;

gulp.task( taskName, () => {
  return gulp
    .src( config.src, { since: gulp.lastRun( taskName ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( eSLint( options.eSLint ) )
    .pipe( eSLint.format() )
    .pipe( eSLint.failAfterError() )
  ;
} )
;
