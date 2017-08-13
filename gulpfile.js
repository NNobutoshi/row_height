var
   fs           = require('fs')
  ,gulp         = require('gulp')
  ,concat       = require('gulp-concat')
  ,plumber      = require('gulp-plumber')
  ,sourcemap    = require('gulp-sourcemaps')
  ,gulpIf       = require('gulp-if')
  ,liveReload   = fs.existsSync('./gulp_livereload.js')? require('./gulp_livereload.js'): null
  ,dist            = 'example'
  ,src             = 'src'
  ,needsSourcemap  = true
  ,tasks = {
     'js:concat' : {
      src : [
         src + '/jquery.resize_events.js'
        ,src + '/jquery.row_height.js'
        ,src + '/init.js'
      ]
      ,watch   : false
      ,default : false
      // ,needsUglify: false
      // ,needsSourcemap: false
    }
    ,'js:remove' : {
      src : [
        src + '/jquery.row_height.js'
      ]
      ,watch   : true
      ,default : true
    }
    ,'watch' : {
      default : true
    }
  }
;

if( typeof liveReload === 'function' && liveReload.needs === true ) {
  gulp.task( 'livereload', liveReload );
  tasks.livereload = {
    default : true
  };
}

gulp.task( 'js:remove', [ 'js:concat' ], function() {
  return gulp
    .src( src + '/jquery.row_height.js' )
    .pipe( gulp.dest( './' ) )
  ;
} )
;

gulp.task( 'js:concat', function() {
  var
     self = tasks[ 'js:concat' ]
    ,flagSourcemap = ( typeof self.needsSourcemap ==='boolean' )? self.needsSourcemap: needsSourcemap
  ;
  return gulp
    .src( self.src )
    .pipe( plumber() )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.init( { loadMaps: true } )
     ) )
    .pipe( concat( 'index.js' ) )
    .pipe( gulpIf(
       flagSourcemap
      ,sourcemap.write( './' )
     ) )
    .pipe( gulp.dest( dist + '/js'  ) )
  ;
} )
;


gulp.task( 'watch', _callWatchTasks );

gulp.task( 'default', _filterDefaultTasks() );

function _callWatchTasks() {
  Object
    .keys( tasks )
    .forEach( function( key ) {
      if ( tasks[ key ].watch && tasks[ key ].watch === true ) {
        gulp.watch( tasks[ key ].src, [ key ] );
      }
  } );
}

function _filterDefaultTasks() {
  return Object
    .keys( tasks )
    .filter( function( key ) {
      if ( tasks[ key ].default && tasks[ key ].default === true ) {
        return key;
      }
  } );
}