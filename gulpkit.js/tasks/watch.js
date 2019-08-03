const
  gulp = require( 'gulp' )

  ,fs = require( 'fs' )

  ,taskName = 'watch'

  ,config = require( '../config.js' ).config

  ,options = config[ taskName ].options
;

gulp.task( taskName, gulp.series( _callWatchTasks, _timeStamp ) );

function _callWatchTasks( done ) {
  Object
    .keys( config )
    .forEach( function( key ) {
      var watch = config[ key ].watch;
      if ( Array.isArray( watch ) ) {
        gulp.watch( watch, options.watch, gulp.series( key ) );
      } else if ( watch === true ) {
        gulp.watch( config[ key ].src, options.watch, gulp.series( key ) );
      }
    } )
  ;
  done();
}

function _timeStamp( done ) {
  fs.writeFileSync( config[ taskName ].tmspFile, new Date().getTime(), 'utf-8', function( error ) {
    if ( error ) {
      config.watch.errorHandler( error );
    }
  } );
  done();
}
