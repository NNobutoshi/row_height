const
  nodeX2j = require( 'xls-to-json' )
  ,fs = require( 'fs' )
  ,charset = 'utf-8'
  ,settings = {
    src         : './src'
    ,extension  : /\.pug?$/
    ,configFile : './src/_config.pug'
    ,indexName  : 'index.pug'
    ,linefeed   : '\n' // '\r\n'
    ,x2j        : {
      input   : './sitemap.xlsx'
      ,output : './output.json'
      ,sheet  : 'Sheet1'
    }
  }
  ,force = ( process.argv.includes( '-f' ) ) ? true : false // 既存の各pug ファイルを刷新するか否か
;

let
  jSONData = {}
;

( function _run() {
  nodeX2j( settings.x2j, function( err, result ) {
    let
      content = ''
      ,string = ''
      ,indent = ''
    ;
    if ( err ) {
      console.error( err );
      return;
    }
    jSONData = _reJsonData( result );
    content = fs.readFileSync( settings.configFile, charset );
    indent = content.match( /[\s\S]+?( +)\/\/{{/ )[ 1 ];
    string = JSON
      .stringify( jSONData, null, '  ' )
      .replace( new RegExp( '^\\{' + '\\' + settings.linefeed, 'g' ), '' )
      .replace( /\}$/, '' )
      .replace( /^ {2}/mg, indent )
    ;
    content = content.replace( /\/\/\{\{[\s\S]*?\/\/\}\}/, `//{{${settings.linefeed + string + indent}//}}` );
    fs.writeFileSync( settings.configFile, content, charset );
    Object.keys( jSONData ).forEach( ( url ) => {
      _recursivelyRunDirectories( jSONData[ url ], _writeFile );
    } );
  } );
} )();


function _reJsonData( data ) {
  const
    res = {}
  ;
  data.forEach( ( item ) => {
    res[ item.url ] = item;
  } );
  return res;
}

function _recursivelyRunDirectories( prop, callback ) {
  let
    leaves = []
    ,parent = ''
    ,url = prop.url
    ,temp = prop.template
    ,htmlUrl = url
    ,pugUrl = ''
  ;
  if ( url.match( /\/$/ ) ) {
    pugUrl = url.replace( /\/$/, '/index.pug' );
  }
  if ( url.match( /\.html?$/ ) ) {
    pugUrl = url.replace( /\.html?$/, '.pug' );
  }
  pugUrl = settings.src + pugUrl;
  leaves = pugUrl.split( '/' );
  leaves.forEach( function( leaf ) {
    if ( parent === '' ) {
      parent = leaf;
    } else {
      parent  = parent + '/' + leaf;
    }
    if ( pugUrl === parent ) {
      callback( pugUrl, htmlUrl, temp );
    } else {
      if ( !fs.existsSync( parent ) ) {
        fs.mkdirSync( parent );
      }
    }
  } );
}

function _writeFile( pugUrl, htmlUrl, template ) {
  if ( !fs.existsSync( pugUrl ) || force ) {
    fs.readFile( template, charset, ( err, content ) => {
      if ( err ) {
        console.error( err );
        return;
      }
      fs.writeFile( pugUrl, content.replace( '//{page}', `"${htmlUrl}"` ), charset, ( err ) => {
        if ( err ) {
          console.error( err );
          return;
        }
        console.info( pugUrl );
      } );
    } );
  }
}
