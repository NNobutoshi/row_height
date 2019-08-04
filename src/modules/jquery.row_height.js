'use strict';

/*!
* jQuery.row_height
* version : 4.0.0
* link    : https://github.com/NNobutoshi/row_height/
* License : MIT
*/

import jQuery from 'jquery';

const
  pluginName = 'rowHeight'
  ,$         = jQuery
;

$[ pluginName ] = class RowHeight {

  constructor() {
    this.$elements = null;
    this.timeoutId = null;
    this.handler = null;
    this.settings = {
      firstClassName  : ''
      ,lastClassName  : ''
      ,delay          : 200
      ,onBefore       : null
      ,onComplete     : null
      ,cssProp        : 'height'
      ,bindType       : ''
      ,bindObj        : window
      ,forEachRow     : true
    };
  }

  init( $elements, children, options ) {
    const
      settings = this.settings = $.extend( {}, this.settings, options )
    ;
    this.$elements = $elements;
    if ( children ) {
      $elements = this.$children = $elements.find( children );
    }
    if ( settings.bindType ) {
      this.handler = () => {
        clearTimeout( this.timeoutId );
        this.timeoutId = setTimeout( () => {
          this.run( $elements, settings );
        }, settings.delay );
      };
      $( settings.bindObj ).on( settings.bindType, this.handler );
    }
    this.run( $elements, settings );
    return this;
  }

  run( elements, options, deferred ) {
    const
      settings = $.extend( {}, this.settings, options )
    ;
    let
      $elements
    ;
    if ( elements instanceof jQuery ) {
      $elements = elements;
    } else if ( elements ) {
      $elements = $( elements );
    }
    if ( typeof settings.onBefore === 'function' ) {
      settings.onBefore();
    }
    if ( $elements ) {
      this.align( $elements, settings, deferred );
    }
    return this;
  }

  align( $elements , settings, deferred ) {
    const
      heights = []
    ;
    let
      paired$
      ,$ends
    ;
    if ( settings.forEachRow === true ) {
      paired$ = this.getRow( $elements );
      $elements = paired$[ 0 ];
      $ends  = paired$[ 1 ];
    }
    $elements
      .css( settings.cssProp, '' )
      .each( ( index, item ) => {
        var
          $this    = $( item )
          ,boxType = $this.css( 'boxSizing' )
        ;
        if ( boxType === 'border-box' ) {
          heights[ heights.length ] = $this.outerHeight();
        } else {
          heights[ heights.length ] = $this.height();
        }
        if ( settings.firstClassName ) {
          if ( index === 0 ) {
            $this.addClass( settings.firstClassName );
          } else {
            $this.removeClass( settings.firstClassName );
          }
        }
        if ( settings.lastClassName ) {
          if ( index === $elements.length - 1 ) {
            $this.addClass( settings.lastClassName );
          } else {
            $this.removeClass( settings.lastClassName );
          }
        }
      } )
      .css( settings.cssProp, Math.max.apply( null, heights ) + 'px' )
    ;
    setTimeout( () => {
      if ( $ends && $ends.length ) {
        settings.children = null;
        this.align( $ends, settings, deferred );
      } else {
        if ( deferred ) {
          deferred.resolve();
          delete this.deferred;
        } else {
          if ( typeof settings.onComplete === 'function' ) {
            settings.onComplete.call( this, this );
          }
        }
      }
    }, 1 );
  }

  getRow( $elements ) {
    let
      firstOffsetTop
      ,$firstRowGroup
      ,$ends
    ;
    $elements
      .each( ( index, item ) => {
        const
          $this         = $( item )
          ,thisOffsetTop = $this.offset().top
        ;
        if ( index === 0 ) {
          firstOffsetTop = thisOffsetTop;
        }
        if ( firstOffsetTop === thisOffsetTop ) {
          if ( !$firstRowGroup ) {
            $firstRowGroup = $this;
          } else {
            $.merge( $firstRowGroup, $this );
          }
        } else {
          if ( !$ends ) {
            $ends = $this;
          } else {
            $.merge( $ends, $this );
          }
        }
      } )
    ;
    return [ $firstRowGroup, $ends ];
  }

  destroy() {
    let
      $elements
    ;
    clearTimeout( this.timeoutId );
    this.timeoutId = null;
    if ( this.settings.bindType ) {
      $( this.settings.bindObj ).off( this.settings.bindType, this.handler );
    }
    delete this.deferred;
    if ( this.$children ) {
      $elements = this.$children;
    } else {
      $elements = this.$elements;
    }
    $elements
      .css( this.settings.cssProp, '' )
      .removeClass( this.settings.firstClassName )
      .removeClass( this.settings.lastClassName )
    ;
    return this
      .$elements
      .removeData( pluginName )
    ;
  }

  then( elements, options ) {
    const
      deferred = $.Deferred()
    ;
    options = options || {};
    if ( this.deferred ) {
      this.deferred.promise().then( () => {
        this.run( elements, options, deferred );
      } );
    } else {
      this.run( elements, options, deferred );
    }
    this.deferred = deferred;
    return this;
  }

};

$.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
  const
    $elements = this
  ;
  let
    thisPlugin
    ,options
    ,children
  ;

  if ( !this.data( pluginName ) ) {

    if ( $[ pluginName ][ arg1 ] ) {

      // $('elements').thisPlugin( 'align', '>li', {'firstClassName': 'foo'} );
      if ( arg2 && arg3 ) {
        children = arg2;
        options = arg3;
      } else if ( arg2 ) {

        // $('elements').thisPlugin( 'align', { 'firstClassName': 'foo'} );
        if ( _isOptions( arg2 ) ) {
          options = arg2;

        // $('elements').thisPlugin( 'align', '>li' );
        } else {
          children = arg2;
        }
      }
    } else {

      // $('elements').thisPlugin( '>li', {'firstClassName': 'foo'} );
      if ( arg1 && arg2 ) {
        children = arg1;
        options = arg2;

      } else if ( arg1 ) {

        // $('elements').thisPlugin( {'firstClassName': 'foo'} );
        if ( _isOptions( arg1 ) ) {
          options = arg1;

        // $('elements').thisPlugin( '>li' );
        } else {
          children = arg1;
        }
      }
    }
    this.data( pluginName,
      new $[ pluginName ]().init( $elements, children, options )
    );
  }

  thisPlugin = this.data( pluginName );

  if ( typeof arg1 === 'string' &&  thisPlugin[ arg1 ] ) {
    return thisPlugin[ arg1 ].apply( thisPlugin, Array.prototype.slice.call( arguments, 1 ) );
  }

  return this;

  function _isOptions( obj ) {
    return typeof obj === 'object' &&
           ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
           ( obj instanceof jQuery === false )
    ;
  }
};
