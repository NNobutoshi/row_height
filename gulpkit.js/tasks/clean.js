import { exec } from 'node:child_process';

import log   from 'fancy-log';
import chalk from 'chalk';

import configFile from '../config.js';

const
  config = configFile.clean
;

/*
 * Git Command をつかってUntracked fileを、削除。
 * 戻り値はPromise。
 */
export default async function clean() {
  await _gitClean( config.command );
}

function _gitClean( comand ) {
  return new Promise( ( resolve ) => {
    exec( comand, ( error, stdout, stderror ) => {
      if ( error || stderror ) {
        log.error( chalk.hex( '#FF0000' )( 'clean.js \n' + error || stderror ) );
      }
      if ( stdout ) {
        log( chalk.green( 'git clean:Removing untracked file' ) );
      }
      resolve();
    } );
  } );
}
