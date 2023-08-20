import path from 'node:path';

import through  from 'through2';
import fancyLog from 'fancy-log';

export default function renderingLog( title ) {
  let renderedFileCounter = 0;
  return through.obj( ( file, enc, callBack ) => {
    fancyLog( `${title} rendered ${path.relative( process.cwd(), file.path )}` );
    renderedFileCounter += 1;
    callBack( null, file );
  }, ( callBack ) => {
    fancyLog( `${title} rendered ${renderedFileCounter} files` );
    callBack();
  } );
}
