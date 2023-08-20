import fs   from 'node:fs';
import path from 'node:path';

import { mkdirp }     from 'mkdirp';
import { deleteSync } from 'del';

const
  FILEPATH  = path.resolve( process.cwd(), '.last_diff/.diffmap' )
  ,DIRNAME  = path.dirname( FILEPATH )
  ,DATANAME = 'myProjectTasksLastDiff'
;
let
  envData = process.env[ DATANAME ]
;

/*
 * Git コマンドで得たタスク終了時までの差分リストを環境変数に格納、取得、
 * また、ファイル保存する。
 */

export default  {
  get   : _get,
  set   : _set,
  write : _write,
  reset : _reset,
};

/*
 * 環境変数に格納されている差分ファイルリストを優先して取得。
 */
function _get() {
  if ( envData ) {
    return envData;
  } else if ( fs.existsSync( FILEPATH ) ) {
    return JSON.parse( fs.readFileSync( FILEPATH, 'utf-8' ) );
  }
  return {};
}

/*
 * 環境変数に格納する。
 */
function _set( map ) {
  envData = map;
}

/*
 * ファイルに書き込み、保存。
 */
function _write() {
  if ( !envData ) {
    return false;
  }
  if ( !fs.existsSync( DIRNAME ) ) {
    mkdirp.sync( DIRNAME );
  }
  fs.writeFileSync( FILEPATH, JSON.stringify( envData, null, 2 ), 'utf-8', ( error ) => {
    if ( error ) {
      throw error;
    }
  } );
}

/*
 * 保存のディレクトリごと削除。
 */
function _reset() {
  deleteSync( DIRNAME );
}
