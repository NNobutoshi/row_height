import gulp from 'gulp';

import configFile from '../config.js';

const
  { watch, series } =  gulp
;
const
  config        = configFile
  ,watchOptions = config.watcher.options.watch
;

export default function watcher( tasks, reload ) {

  return function watch_init( cb ) {

    for ( const [ taskName, task ] of Object.entries( tasks ) ) {
      const
        taskConfig = config[ taskName ]
      ;
      if ( taskConfig && taskConfig.watch === true && taskConfig.src ) {
        if ( typeof reload === 'function' ) {
          watch( taskConfig.src, watchOptions, series( task, reload ) );
        } else {
          watch( taskConfig.src, watchOptions, task );
        }
      }
    } // for

    if ( typeof cb === 'function' ) {
      cb();
    }

  };
}
