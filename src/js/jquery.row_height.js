/*!
* jQuery.row_height
* version : 3.1.0
* link    : https://github.com/NNobutoshi/row_height/
* License : MIT
*/

import jQuery from 'jquery';
( function( $, window, undefined ) {
  'use strict';
  var
    pluginName = 'rowHeight'
  ;
  $[ pluginName ] = {
    $elements  : null
    ,timeoutId : null
    ,handler   : null
    ,settings  : {
      firstClassName  : ''
      ,lastClassName  : ''
      ,delay          : 200
      ,onBefore       : null
      ,onComplete     : null
      ,cssProp        : 'height'
      ,bindType       : ''
      ,bindObj        : window
      ,forEachRow     : true
    }
    ,init : function( $elements, children, options ) {
      var
        that = this
        ,settings
      ;
      settings = this.settings = $.extend( {}, this.settings, options );
      this.$elements = $elements;
      if ( children ) {
        $elements = this.$children = $elements.find( children );
      }
      if ( settings.bindType ) {
        this.handler = function() {
          clearTimeout( that.timeoutId );
          that.timeoutId = setTimeout( function() {
            that.run( $elements, settings );
          }, settings.delay );
        };
        $( settings.bindObj )
          .on( settings.bindType, this.handler )
        ;
      }
      that.run( $elements, settings );
      return this;
    }
    ,run : function( elements, options, deferred ) {
      var
        settings
        ,$elements
      ;
      if ( elements instanceof jQuery ) {
        $elements = elements;
      } else if ( elements ) {
        $elements = $( elements );
      }
      settings = $.extend( {}, this.settings, options );
      if ( $.isFunction( settings.onBefore ) ) {
        settings.onBefore();
      }
      if ( $elements ) {
        this.align( $elements, settings, deferred );
      }
      return this;
    }
    ,align : function( $elements , settings, deferred ) {
      var
        that     = this
        ,heights = []
        ,paired$
        ,$ends
      ;
      if ( settings.forEachRow === true ) {
        paired$ = this.getRow( $elements );
        $elements = paired$[ 0 ];
        $ends  = paired$[ 1 ];
      }
      $elements
        .css( settings.cssProp, '' )
        .each( function( index ) {
          var
            $this    = $( this )
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
      setTimeout( function() {
        if ( $ends && $ends.length ) {
          settings.children = null;
          that.align( $ends, settings, deferred );
        } else {
          if ( deferred ) {
            deferred.resolve();
            delete that.deferred;
          }
          if ( $.isFunction( settings.onComplete ) ) {
            settings.onComplete();
          }
        }
      }, 1 );
    }
    ,getRow : function( $elements ) {
      var
        firstOffsetTop
        ,$firstRowGroup
        ,$ends
      ;
      $elements
        .each( function( index ) {
          var
            $this         = $( this )
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
    ,destroy : function() {
      var $elements;
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
    ,then: function( elements, options ) {
      var
        deferred = $.Deferred()
        ,that    = this
      ;
      options = options || {};
      if ( this.deferred ) {
        this.deferred.promise().then( function() {
          that.run( elements, options, deferred );
        } );
      } else {
        this.run( elements, options, deferred );
      }
      this.deferred = deferred;
      return this;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      rowHeight
      ,$elements = this
      ,options
      ,children
      ,_isOptions = function( obj ) {
        return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
        obj instanceof jQuery === false;
      }
    ;
    if ( !this.data( pluginName ) ) {
      if ( $[ pluginName ][ arg1 ] ) {
        if ( arg2 && arg3 ) {
          children = arg2;
          options = arg3;
        } else if ( arg2 ) {
          if ( _isOptions( arg2 ) ) {
            options = arg2;
          } else {
            children = arg2;
          }
        }
      } else {
        if ( arg1 && arg2 ) {
          children = arg1;
          options = arg2;
        } else if ( arg1 ) {
          if ( _isOptions( arg1 ) ) {
            options = arg1;
          } else {
            children = arg1;
          }
        }
      }
      this.data( pluginName, _inherit( $[ pluginName ] ).init( $elements, children, options ) );
    }
    rowHeight = this.data( pluginName );
    if ( rowHeight[ arg1 ] ) {
      return rowHeight[ arg1 ].apply( rowHeight, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
  };
  function _inherit( o ) {
    if ( Object.create ) {
      return Object.create( o );
    }
    var F = function() {};
    F.prototype = o;
    return new F();
  }
} )( jQuery, window );
