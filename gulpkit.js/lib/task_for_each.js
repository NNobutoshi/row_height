import path from 'node:path';

import through     from 'through2';
import mergeStream from 'merge-stream';

export default function taskForEach( group, base, branchTask ) {
  const srcCollection = {};
  return _groupSrc( srcCollection, group, base, branchTask );
}

/*
 * 指定のグループに従ってsource を小分けする。
 */
function _groupSrc( srcCollection, group, base, branchTask ) {

  group = group.replace( /[/\\]/g, path.sep );

  return through.obj( _transform, _flush );

  function _transform( file, enc, callBack ) {
    const
      splits  = file.path.split( group )
      ,parent = splits[ 0 ] + group
      ,child  = splits[ 1 ]
    ;
    if ( !srcCollection[ parent ] ) {
      srcCollection[ parent ] = {
        children : [],
        baseDir  : splits[ 0 ].replace( path.resolve( process.cwd(), base ), '' ),
      };
    }
    srcCollection[ parent ].children.push( child );
    callBack( null, file );
  }

  /*
   * callBack は後の _forEach に渡し、全部の branchTask を実行後まで保留。
   */
  function _flush( callBack ) {
    _forEach( srcCollection, branchTask, callBack );
  }

}

/*
 * branchTask は、小分けしたグループ毎、Gulp.src 用の新しいsourceとdest 用のパスを渡し、
 * Gulp のストリームを受け取る。
 */
function _forEach( srcCollection, branchTask, callBack ) {
  const streams = [];
  for ( let key in srcCollection ) {
    streams.push(
      branchTask(
        srcCollection[ key ].children.map( ( item ) => key + item ),
        srcCollection[ key ].baseDir.replace( /[/\\]/g, '/' ),
      )
    );
  }

  /*
   * _groupSrc から渡された基のstream のcallBack をここで実行。
   */
  if ( streams.length > 0 ) {
    mergeStream( ...streams ).on( 'finish', callBack );
  } else {
    callBack();
  }

}
