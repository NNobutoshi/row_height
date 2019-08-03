const
  gulp = require( 'gulp' )
  ,tap = require( 'gulp-tap' )

  ,beautifyHtml = require( 'js-beautify' ).html
  ,pug          = require( 'pug' )

  ,taskName = 'html_pug'

  ,config   = require( '../config.js' ).config[ taskName ]
  ,settings = require( '../config.js' ).settings

  ,options = config.options
;

gulp.task( taskName, () => {
  let
    stream
  ;
  stream = gulp
    .src( config.src, { since: gulp.lastRun( taskName ) } )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
  return stream;
} )
;

gulp.task( `${taskName}_partial`, () => {
  let
    stream
  ;
  stream = gulp
    .src( config.src )
    .pipe( tap( _pugRender ) )
    .pipe( gulp.dest( settings.dist ) )
  ;
  return stream;
} )
;

function _pugRender( file, t ) {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/?[.#].+?)-->/mg
    ,errorHandler = options.errorHandler
  ;
  let
    contents = ''
  ;
  options.pug.filename = file.path;
  try {
    contents = pug.render( String( file.contents ), options.pug );
  } catch ( e ) {
    errorHandler( e );
  }
  if ( options.assistPretty.assistAElement ) {
    contents = contents.replace( ugliyAElementRegEx, function( _all, indent, element, linefeed ) {
      element = element
        .replace( '><a ', '>' + linefeed + '<a ' )
        .replace( '</a>', '</a>' + linefeed )
      ;
      return beautifyHtml( element, options.beautifyHtml ).replace( /^/mg, indent );
    } );
  }
  if ( options.assistPretty.indent === false ) {
    contents = contents.replace( /^([\t ]+)/mg, '' );
  }
  if ( options.assistPretty.commentPosition ) {
    contents = contents.replace( endCommentRegEx, _replacementEndComment );
  }
  file.contents = new global.Buffer.from( contents );
  file.path = file.path.replace( /\.pug$/, '.html' );
  return t.through;

  function _replacementEndComment( _all, endTag, lineFeed, indent, comment ) {
    comment = '<!--' + comment + '-->';
    if ( options.assistPretty.commentPosition === 'inside' ) {
      if ( options.assistPretty.commentOnOneLine === true ) {
        if ( options.assistPretty.emptyLine === true ) {
          return comment + endTag + lineFeed;
        } else {
          return comment + endTag;
        }
      } else {
        if ( options.assistPretty.emptyLine === true ) {
          return comment + lineFeed + indent + endTag + lineFeed;
        } else {
          return comment + lineFeed + indent + endTag;
        }
      }
    } else {
      if ( options.assistPretty.commentOnOneLine === true ) {
        if ( options.assistPretty.emptyLine === true ) {
          return endTag + comment + lineFeed;
        } else {
          return endTag + comment;
        }
      } else {
        if ( options.assistPretty.emptyLine === true ) {
          return endTag + lineFeed + indent + comment + lineFeed;
        } else {
          return endTag + lineFeed + indent + comment;
        }
      }
    }
  }

}
