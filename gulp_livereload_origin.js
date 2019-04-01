
var
  gulp         = require('gulp')
  ,bs           = require('browser-sync')
  ,type         = 'normal' // 'normal' or 'proxy'
  ,proxy        = 'localhost:8000'
  ,port         = 9000
  ,documentRoot = 'example'
  ,flag         = false
  ,_init        = function() {
    var
      timeoutId = null
      ,time      = 300
    ;
    if( type === 'normal') {
      bs( {
        server : {
          baseDir : documentRoot
        }
        ,port    : port
        ,browser : [ 'chrome' ]
      } );
    } else if ( type === 'proxy' ) {
      bs( {
        proxy : proxy
        ,port : port
      } );
    } else {
      return false;
    }
    gulp.watch( documentRoot + '/**', function() {
      clearTimeout( timeoutId );
      timeoutId = null;
      timeoutId = setTimeout( bs.reload, time );
    });
  }
;

if ( flag === true ) {
  _init.needs = flag;
}
module.exports = _init;

gulp.task( 'serverTask', _init );
gulp.task( 'default', [ 'serverTask' ] );