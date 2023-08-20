import fs   from 'node:fs';
import path from 'node:path';

import gulp     from 'gulp';
import plumber  from 'gulp-plumber';
import pug      from 'pug';
import through  from 'through2';
import beautify from 'js-beautify';
import chalk    from 'chalk';
import sizeOf   from 'image-size';

import diff, { selectTargetFiles } from '../lib/diff_build.js';
import renderingLog                from '../lib/rendering_log.js';

import configFile from '../config.js';

const
  { src, dest } = gulp
;
const
  config = configFile.html_pug
  ,options  = config.options
;

export default function html_pug() {
  const pugData = JSON.parse( fs.readFileSync( config.data ).toString() );
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ,_collectTargetFiles ,selectTargetFiles ) )
    .on( 'data', ( file ) => {
      const keyFilePath = file.path
        .replace( path.resolve( process.cwd(), config.base ), '' )
        .replace( /\\/g, '/' )
        .replace( /\.pug$/, '.html' )
      ;
      file.data = {
        siteData : pugData.defaults,
        pageData : pugData[ keyFilePath ],
      };
    } )
    .pipe( _pugRender() )
    .pipe( _postPug() )
    .pipe( dest( config.dist ) )
    .pipe( renderingLog( '[html_pug]:' ) )
  ;
}

/*
 * 依存関係を調べ、Objectにまとめる。
 * through2 のtransformFunction 中で実行。
 * chunk のcontents から読み込んでいるパスを調べる
 *
 * collection
 * {
 *   '読み込んでいるパス': [
 *     'chunk自身のパス'
 *    ]
 * }
 */
function _collectTargetFiles( file, collection ) {
  const
    contents = String( file.contents )
    ,regex = /^.*?(extends|include) *(.+)$/mg
    ,matches = contents.matchAll( regex )
  ;
  for ( const match of matches ) {
    let dependentFilePath;
    if ( /^\//.test( match[ 2 ] ) ) {
      // ルートパスであれば
      dependentFilePath = path.join( path.resolve( process.cwd(), config.base ), match[ 2 ] );
    } else {
      // 相対パスであれば
      dependentFilePath = path.resolve( file.dirname, match[ 2 ] );
    }
    if ( !collection[ dependentFilePath ] ) {
      collection[ dependentFilePath ] = [];
    }
    collection[ dependentFilePath ].push( file.path );
  }
}

function _pugRender() {
  const ignoreFileRegEx = /^_/;

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    if ( ignoreFileRegEx.test( path.basename( file.path ) ) ) {
      return callBack();
    }
    Object.assign( options.pug, {
      filename : file.path,
      self     : true,
      siteData : file.data.siteData,
      pageData : file.data.pageData,
    } );
    pug.render( String( file.contents ), options.pug, ( error, contents ) => {
      if ( error ) {
        this.emit( 'error', error );
        console.log( chalk.hex( '#FF0000' )( file.path ) );
        return callBack();
      }
      file.contents = new Buffer.from( contents );
      file.path = file.path.replace( /\.pug$/, '.html' );
      callBack( null, file );
    } );
  }

  function _flush( callBack ) {
    callBack();
  }

}

/*
 * Pug のrender 後実行。
 * HTML の体裁を整える。
 */
function _postPug() {
  const
    ugliyAElementRegEx = /^([\t ]*)([^\r\n]*?<a [^>]+>(\r?\n|\r)[\s\S]*?<\/a>[^\r\n]*)$/mg
    ,endCommentRegEx   = /(<\/.+?>)(\r?\n|\r)(\s*)<!--(\/[.#].+?)-->/mg
    ,imgRegEx = /<(img|source)(.*?)(src|srcset)=(["'])(.+?)["'](.*?)>/g
  ;
  const stream = through.obj( ( file, enc, callBack ) => {
    const
      promiseReplaceImgStringsAll = []
      ,objReplaceImgText = {}
    ;
    let contents = String( file.contents );

    /*
     * オプションで指定があれば、
     * <div> などを内包する<a> の体裁を整える。
     *
     * <a>             \ <a>
     *  <div>          \   <div>
     *  </div></a>     \   </div>
     *                 \ </a>
     */
    if ( options.assistPretty.assistAElement ) {
      contents = contents.replace(
        ugliyAElementRegEx
        ,function( _all, indent, element, linefeed ) {
          element = element
            .replace( '><a ', '>' + linefeed + '<a ' )
            .replace( '</a>', '</a>' + linefeed )
          ;
          return beautify.html( element, options.beautifyHtml ).replace( /^/mg, indent );
        } )
      ;
    }

    /*
     * オプションで指定があれば、インデントをトル。
     */
    if ( options.assistPretty.indent === false ) {
      contents = contents.replace( /^([\t ]+)/mg, '' );
    }

    /*
     * 閉じタグ付近に付けるコメントに関する体裁。
     */
    if ( options.assistPretty.commentPosition ) {
      contents = contents.replace( endCommentRegEx, _replacementEndComment );
    }
    if ( options.imgSize === false ) {
      file.contents = new global.Buffer.from( contents );
      return callBack( null, file );
    }

    /*
     * img サイズの自動挿入
     */
    for ( const match of contents.matchAll( imgRegEx ) ) {
      const
        tagName       = match[ 1 ]
        ,frontPart    = match[ 2 ]
        ,attrName     = match[ 3 ]
        ,q            = match[ 4 ]
        ,srcPath      = match[ 5 ]
        ,rearPart     = match[ 6 ]
      ;
      if ( match[ 0 ].indexOf( 'width' ) > -1 || match[ 0 ].indexOf( 'height' ) > -1 ) {
        continue;
      }
      promiseReplaceImgStringsAll.push( new Promise( ( resolve ) => {
        sizeOf( path.resolve( file.dirname, srcPath ), ( error, dm ) => {
          if ( error ) {
            stream.emit( 'error', error );
          }
          const
            text  = `<${tagName}${frontPart}${attrName}=${q}${srcPath}${q} ` +
                    `width=${q}${dm.width}${q} height=${q}${dm.height}${q}${rearPart}>`
          ;
          objReplaceImgText[ match [ 0 ] ] = text;
          resolve();
        } );
      } ) );
    } // for

    Promise
      .all( promiseReplaceImgStringsAll )
      .then( () => {
        contents = contents.replace( imgRegEx, ( all ) => {
          return objReplaceImgText[ all ] || all;
        } );
        file.contents = new global.Buffer.from( contents );
        callBack( null, file );
      } )
    ;

    return;

  } );

  return stream;
}

function _replacementEndComment( _all, endTag, lineFeed, indent, comment ) {
  comment = '<!--' + comment + '-->';

  /*
   * コメントを閉じタグ内側に付けたい場合。
   */
  if ( options.assistPretty.commentPosition === 'inside' ) {

    /*
     * コメントと閉じタグを1行にまとめるか否か。
     * <!-- --></div>
     * or
     * <!-- -->
     * </div>
     */
    if ( options.assistPretty.commentOnOneLine === true ) {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return comment + endTag + lineFeed;
      } else {
        return comment + endTag;
      }
    } else {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return comment + lineFeed + indent + endTag + lineFeed;
      } else {
        return comment + lineFeed + indent + endTag;
      }
    }

  /*
   * コメントを閉じタグ外側に付けたい場合。
   */
  } else {

    /*
     * コメントと閉じタグを1行にまとめるか否か。
     * </div><!-- -->
     * or
     * </div>
     * <!-- -->
     */
    if ( options.assistPretty.commentOnOneLine === true ) {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + comment + lineFeed;
      } else {
        return endTag + comment;
      }
    } else {

      /*
       * コメントの付いた閉じタグ後に空行をつけるか否か。
       */
      if ( options.assistPretty.emptyLine === true ) {
        return endTag + lineFeed + indent + comment + lineFeed;
      } else {
        return endTag + lineFeed + indent + comment;
      }
    }
  }
}
