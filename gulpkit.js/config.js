const
  autoprefixer = require( 'autoprefixer' )
  ,babelify    = require( 'babelify' )
  ,merge       = require( 'lodash/mergeWith' )
  ,notify      = require( 'gulp-notify' )
;

const NODE_ENV = process.env.NODE_ENV;

let
  config
  ,settings
;

const settings_dev = {
  dist      : 'example',
  src       : 'src',
  sourcemap : true,
}
;

const settings_prod = {
  dist      : 'example',
  src       : 'src',
  sourcemap : true,
}
;


if ( NODE_ENV === 'production' ) {
  settings = merge( {}, settings_dev, settings_prod );
} else if ( !NODE_ENV || NODE_ENV === 'development' ) {
  settings = settings_dev;
}

const
  config_dev = {
    'css_sass' : {
      src       : [ settings.src + '/**/*.scss' ],
      watch     : true,
      default   : true,
      cssMqpack : true,
      sourcemap : true,
      options   : {
        del : {
          dist : [ settings.dist + '/**/*.css.map' ],
          options : {
            force : true,
          },
        },
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        postcss : {
          plugins : [ autoprefixer() ]
        },
        sass : {
          outputStyle : 'compact', // nested, compact, compressed, expanded
          linefeed    : 'lf', // 'crlf', 'lf'
          indentType  : 'space', // 'space', 'tab'
          indentWidth : 2,
        },
      },
    },
    'js_bundle' : {
      src       : [ settings.src + '/**/*bundle.js' ],
      watch     : false,
      default   : true,
      uglify    : false,
      sourcemap : true,
      options   : {
        del : {
          dist : [ settings.dist + '/**/*.js.map' ],
          options : {
            force : true,
          },
        },
        errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        browserify : {
          cache        : {},
          packageCache : {},
          transform    : [ babelify ],
        },
        watchify : {
          poll: true,
        },
        uglify : {
          output : {
            comments : /^!|(@preserve|@cc_on|\( *c *\)|license|copyright)/i,
          },
        },
      },
    },
    'js_eslint' : {
      src : [
        ''  + '*.js',
        ''  + 'gulpkit.js/**/*.js',
        ''  + settings.src + '/**/*.js',
        '!' + settings.src + '/**/_vendor/*.js',
      ],
      watch   : true,
      default : true,
      options : {
        plumber : {
          errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        },
        eSLint : {
          useEslintrc: true,
        },
      },
    },
    'html_pug' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
        '!' + settings.src + '/**/_*/**/*.pug',
      ],
      watch   : true,
      default : true,
      options : {
        assistPretty : {
          assistAElement   : true,
          commentPosition  : 'inside',
          commentOnOneLine : true,
          emptyLine        : true,
          indent           : true,
        },
        beautifyHtml : {
          indent_size : 2,
          indent_char : ' ',
        },
        errorHandler : notify.onError( 'Error: <%= error.message %>' ),
        pug : {
          pretty  : true,
          basedir : settings.src,
        },
      },
    },
    'html_pug_partial' : {
      src : [
        ''  + settings.src + '/**/*.pug',
        '!' + settings.src + '/**/_*.pug',
      ],
      watch   : [ settings.src + '/**/_*.pug' ],
      default : true,
    },
    'watch' : {
      default      : true,
      errorHandler : notify.onError( 'Error: <%= error.message %>' ),
      tmspFile     : './gulpkit.js/tasks/.timestamp',
      options : {
        watch : {
          usePolling : true
        },
      }
    },
  }
;

const
  config_prod = {
    'css_sass' : {
      watch     : false,
      sourcemap : false,
      options : {
        sass : {
          outputStyle : 'compressed',
        },
      }
    },
    'js_bundle' : {
      uglify    : true,
      sourcemap : false,
    },
    'js_eslint' : {
      watch : false,
    },
    'html_pug' : {
      watch : false,
    },
    'html_pug_children' : {
      watch : false,
    },
    'watch' : {
      default : false,
    },
  }
;

if ( NODE_ENV === 'production' ) {
  config = merge( {}, config_dev, config_prod );
} else if ( !NODE_ENV || NODE_ENV === 'development' ) {
  config = config_dev;
}

module.exports = {
  settings : settings,
  config  : config,
}
;
