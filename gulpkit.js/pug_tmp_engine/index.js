import fs   from 'node:fs';
import path from 'node:path';
import url  from 'node:url';

import { mkdirp } from 'mkdirp';
import log        from 'fancy-log';
import XLSX       from 'xlsx';

const
  CHARSET               = 'utf-8'
  ,SRC_DIR              = '../../src'
  ,PUG_CONFIG_FILE_PATH = '../../src/_data/_pug_data.json'
  ,SITE_MAP_FILE_PATH   = '../../src/_data/sitemap.xlsx'
  ,DIRNAME              = path.dirname( url.fileURLToPath( import.meta.url ) )
  ,settings = {
    src          : path.resolve( DIRNAME, SRC_DIR ),
    extension    : /\.pug?$/,
    configFile   : path.resolve( DIRNAME, PUG_CONFIG_FILE_PATH ),
    indexName    : 'index.pug',
    linefeed     : '\n', // '\r\n'
    sheetName    : 'Sheet1',
    xlsxFilePath : path.resolve( DIRNAME, SITE_MAP_FILE_PATH ),
  }
  ,force = ( process.argv.includes( 'force' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

( async function _run() {
  const
    workBook     = XLSX.readFile( settings.xlsxFilePath )
    ,jSONData    = _xlsxToJson( workBook )
    ,confStrings = await _readConfigFile()
    ,indent      = _getIndent( confStrings, /[\s\S]+?( +)"{{": "",/ )
    ,dataStrings = _deleteWrapperParen( jSONData, indent )
  ;
  _writePugConfigFile( confStrings, dataStrings, indent );
  for ( let url in jSONData ) {
    _createPugFileByProps( jSONData[ url ], _createPugFile );
  }
} )();

function _xlsxToJson( workBook ) {
  return _reJsonData(
    XLSX.utils.sheet_to_json( workBook.Sheets[ settings.sheetName ] )
  );
}

function _readConfigFile() {
  return new Promise( ( resolve, reject ) => {
    fs.readFile( settings.configFile, CHARSET, ( error, content ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      return resolve( content );
    } );
  } );
}

function _getIndent( configContent, indentRegeX ) {
  const
    matches = configContent.match( indentRegeX )
  ;
  return ( matches !== null &&  matches[ 1 ] ) ? matches[ 1 ] : false;
}

function _deleteWrapperParen( jSONData, indent ) {
  return JSON
    .stringify( jSONData, null, 2 )
    .replace( new RegExp( `^\\{\\${settings.linefeed}` ), '' )
    .replace( new RegExp( `\\}\\${settings.linefeed}\\}` ), `},${settings.linefeed}` )
    .replace( /^ {2}/mg, indent )
  ;
}

function _writePugConfigFile( content, newStrings, indent ) {
  content = content.replace( /"{{": "",[\s\S]*?"}}": ""/, `"{{": "",${settings.linefeed + newStrings + indent}"}}": ""` );
  fs.writeFile( settings.configFile, content, CHARSET, ( error )  => {
    if ( error ) {
      return console.error( error );
    }
    log( `configed  "${path.relative( process.cwd(), settings.configFile )}"` );
  } );
}

function _reJsonData( data ) {
  const
    res = {}
  ;
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

function _createPugFileByProps( props, callback ) {
  let
    url      = props.url
    ,temp    = props.template
    ,htmlUrl = url
    ,pugUrl  = ''
  ;
  if ( url.match( /\/$/ ) ) {
    pugUrl = url.replace( /\/$/, '/index.pug' );
  }
  if ( url.match( /\.html?$/ ) ) {
    pugUrl = url.replace( /\.html?$/, '.pug' );
  }
  pugUrl = path.join( settings.src , pugUrl );
  mkdirp.sync( path.dirname( pugUrl ) );
  callback( pugUrl, htmlUrl, temp );
}

async function _createPugFile( pugUrl, htmlUrl, template ) {
  let
    content
    ,isNew = !fs.existsSync( pugUrl )
  ;
  if ( !isNew && force === false ) {
    return;
  }
  content = await _readTemplateFile( template );
  await _writePugFile( content, pugUrl, htmlUrl, isNew );
}

function _readTemplateFile( template ) {
  return new Promise( ( resolve, reject ) => {
    fs.readFile( path.join( settings.src, template ), CHARSET, ( error, content ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      return resolve( content );
    } );
  } );
}

function _writePugFile( content, pugUrl, htmlUrl, isNew ) {
  return new Promise( ( resolve, reject ) => {
    fs.writeFile( pugUrl, content.replace( '//{page}', `"${htmlUrl}"` ), CHARSET, ( error ) => {
      if ( error ) {
        reject();
        return console.error( error );
      }
      if ( isNew ) {
        log( `new created "${path.relative( process.cwd(), pugUrl )}"` );
      } else {
        log( `renewed     "${path.relative( process.cwd(), pugUrl )}"` );
      }
      resolve();
    } );
  } );
}
