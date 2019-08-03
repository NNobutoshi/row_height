const
  gulp = require( 'gulp' )

  ,requireDir = require( 'require-dir' )

  ,config = require( './config.js' ).config
;

requireDir( './tasks' );

gulp.task( 'default', gulp.series(
  Object
    .keys( config )
    .filter( function( key ) {
      return config[ key ].default === true;
    } ) )
)
;
