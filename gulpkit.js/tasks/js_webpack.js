import path from 'node:path';

import gulp      from 'gulp';
import plumber   from 'gulp-plumber';
import webpack   from 'webpack';
import log       from 'fancy-log';
import through   from 'through2';
import mergeWith from 'lodash/mergeWith.js';
import isEqual   from 'lodash/isEqual.js';

import configFile from '../config.js';

const
  { src } = gulp
;
const
  config   = configFile.js_webpack
  ,options = config.options
;
let
  compiler = null
  ,webpackConfig = config.webpackConfig
  ,entries
  ,cacheGroups
;

/*
 * cache 機能や差分ビルド機能は、Webpack の備えているものを。
 * watch はGulpのものを使用。
 * entry や splitChunks は、Gulp.src() 後,chumk が通ってくる毎に作成し、
 * 既存の webpackConfigと 比較して差異があれば再代入する。
 */

/*
 * config.js 側で'filesystem' の指定があれば、cacheDirectory はここで指定。
 * 'memory' が指定されているとcacheDirectory をそのままにしておけないため。
 */
if ( webpackConfig.cache && webpackConfig.cache.type === 'filesystem' ) {
  webpackConfig.cache.cacheDirectory = config.cacheDirectory;
}


export default function js_webpack() {
  return src( config.src )
    .pipe( plumber( options.plumber ) )
    .pipe( _createEntries() )
    .pipe( _compile() )
  ;
}

function _createEntries() {
  let
    regexTarget = config.targetEntry // /\.entry\.js$/
    ,regexShareFileConf = config.shareFileConf // /\.split\.json$/
  ;

  entries = {};
  cacheGroups = {};

  return through.obj( _transform, _flush );

  /*
   * chunkのpath やconfig.js の設定からentry や splitChunks を作る。
   */
  function _transform( file, enc, callBack ) {
    let key, val;

    /*
     * chunk のPath が、splitChunks用のJSON Data であれば、
     * chunk のcontentsを webpackConfig で使用可能な状態にする。
     */
    if ( regexShareFileConf && regexShareFileConf.test( file.path ) ) {
      cacheGroups = _createSplitChunks( cacheGroups, file.contents );
    }

    /*
     * entry であれば、webpackConfig で使用可能な状態にする。
     */
    if ( regexTarget.test( file.path ) ) {
      key = path.relative( config.base, file.path ).replace( regexTarget, '' ).replace( /\\/g, '/' );
      val = path.relative( process.cwd(), file.path ).replace( /\\/g , '/' );
      val = /^\.?\.\//.test( val ) ? val : './' + val;
      entries[ key ] = val;
    }
    callBack( null, file );
  }

  /*
   * compiler がまだ無いか、
   * 新たに作ったentreis や splitChunks がWebpackConfig のものと相違があれば、
   * compiler を用意する。
   */
  function _flush( callBack ) {
    if ( compiler === null ||
      !isEqual( webpackConfig.entry, entries ) ||
      !isEqual( webpackConfig.optimization.splitChunks.cacheGroups, cacheGroups )
    ) {
      mergeWith( webpackConfig, {
        entry : entries,
        output : {
          filename : '[name].js',
          path : path.resolve( process.cwd(), config.dist ),
        },
        optimization : {
          splitChunks : {
            cacheGroups : cacheGroups,
          }
        }
      } );
      compiler = webpack( webpackConfig );
    }
    callBack();
  }

}

function _compile() {
  return through.obj( _transform, _flush );
  function _transform( file, enc, callBack ) {
    callBack( null, file );
  }
  function _flush( callBack ) {
    compiler.run( _webPackCall( callBack, this ) );
  }
}

function _webPackCall( callBack, stream ) {
  return ( error, stats ) => {
    let errorMessages = [];
    if ( error ) {
      return stream.emit( 'error', error );
    }
    if ( stats && stats.hasErrors && stats.hasErrors() ) {
      stats.toJson().errors.forEach( ( item ) => {
        errorMessages.push( item.message );
      } );
      stream.emit( 'error', new Error( errorMessages.join( '\n' ) ) );
    }
    if ( stats ) {
      log( stats.toString( {
        colors : true,
        chunks : false,
        assets : false,
        hash   : true,
        errors : false,
      } ) );
    }
    callBack();
  };
}

/*
 * vendor など、ディレクトリで共通で使用するモジュールは、
 * そのディレクトリ毎で設定が行えるようにする。
 * そのためのJSON data をwebpackConfig で使用可能な状態にする。
 */
function _createSplitChunks( groups, subConfContents ) {
  const
    subConfObj = JSON.parse( subConfContents )
  ;
  for ( let [ key, value ] of Object.entries( subConfObj ) ) {
    const test = value.test.join( '|' ).replace( /\//g, '[\\\\/]' );
    subConfObj[ key ].test = new RegExp( test );
  }
  return mergeWith( {}, groups, subConfObj );
}
