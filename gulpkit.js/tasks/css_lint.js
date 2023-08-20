import gulp      from 'gulp';
import through   from 'through2';
import plumber   from 'gulp-plumber';
import stylelint from 'stylelint';

import diff       from '../lib/diff_build.js';
import configFile from '../config.js';

const
  { src, lastRun } = gulp
;
const
  config = configFile.css_lint
  ,options = config.options
;

/*
 * one source → destination 無しなので diff build はGulp.lastRun と併用する。
 */

export default function css_lint() {
  return src( config.src, { since : lastRun( css_lint ) } )
    .pipe( plumber( options.plumber ) )
    .pipe( diff( options.diff ) )
    .pipe( ( function() {
      const lintedList = [];
      return through.obj(
        function( file, enc, callBack ) {
          lintedList.push( file.path );
          callBack( null, file );
        },
        function( callBack ) {
          stylelint.lint( {
            files: lintedList,
            formatter: 'string',
          } )
            .then( ( { output, errored } ) =>  {
              console.log( output );
              callBack();
            } )
            .catch( error =>  {
              if ( lintedList.length > 0 ) {
                this.emit( 'error', error );
              }
              callBack();
            } );
        }
      );//return through.obj
    } )() )
  ;
}

