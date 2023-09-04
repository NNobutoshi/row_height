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
    $base : null
    ,$elemTargets  : null
    ,timeoutId : null
    ,handle    : null
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
    ,init : function( $elemTargets, children, options ) {
      var
        settings = this.settings = $.extend( {}, this.settings, options )
        ,that = this
      ;
      this.$base = $elemTargets;
      if ( children ) {
        $elemTargets = this.$base.find( children );
      }
      this.$elemTargets = $elemTargets;
      this.handle = function() {
        clearTimeout( that.timeoutId );
        that.timeoutId = setTimeout( function() {
          that.run();
        }, that.settings.delay );
      };
      if ( settings.bindType ) {
        $( settings.bindObj )
          .on( settings.bindType, this.handle )
        ;
      }
      this.run();
      return this;
    }
    ,run: function() {
      var
        $initialTargets = this.$elemTargets
        ,that = this
        ,settings = this.settings
      ;
      this.setDataOfDepth();
      ( function _setMaxHeightForEachRow( $elements ) {
        setTimeout( function() {
          $elements = that.get1stTargetRow( $elements );
          that.setMaxHeigthOneRow( $elements );
          if ( $elements.length > 0 ) {
            $initialTargets = $initialTargets.not( $elements );
            _setMaxHeightForEachRow( $initialTargets );
          } else {
            if ( typeof settings.onComplete === 'function' ) {
              settings.onComplete( that.$base );
            }
          }
        }, 16 );
      } )( $initialTargets );
    }
    ,setMaxHeigthOneRow: function( $elements ) {
      var
        heightData = []
        ,settings = this.settings
      ;
      $elements
        .css( settings.cssProp, '' )
        .each( function( index, elem ) {
          var
            $elem    = $( elem )
            ,boxType = $elem.css( 'boxSizing' )
          ;
          $elem.removeAttr( 'data-rowheight-depth' );
          if ( boxType === 'border-box' ) {
            heightData[ heightData.length ] = $elem.outerHeight();
          } else {
            heightData[ heightData.length ] = $elem.height();
          }
          if ( settings.firstClassName ) {
            if ( index === 0 ) {
              $elem.addClass( settings.firstClassName );
            } else {
              $elem.removeClass( settings.firstClassName );
            }
          }
          if ( settings.lastClassName ) {
            if ( index === $elements.length - 1 ) {
              $elem.addClass( settings.lastClassName );
            } else {
              $elem.removeClass( settings.lastClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
      ;
    }
    ,get1stTargetRow: function( $elements ) {
      var $rowGroup = $();
      _getRowGroup( $elements );
      return $rowGroup;
      function _getRowGroup( $elements ) {
        var
          minPosY = Infinity
          ,hasChildInLine = false
          ,maxDepth = -1
        ;
        $elements
          .each( function( index ,elem ) {
            var
              $elem = $( elem )
              ,posY = $elem.offset().top
              ,depth = parseInt( $elem.attr( 'data-rowheight-depth' ) )
            ;
            if ( posY < minPosY && depth > maxDepth ) {
              hasChildInLine = false;
              minPosY = posY;
              maxDepth = depth;
              $rowGroup = $();
            }
            if ( posY === minPosY && depth === maxDepth ) {
              $rowGroup = $.merge( $rowGroup, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } );
        if ( hasChildInLine === true ) {
          _getRowGroup( $elements.not( $rowGroup ) );
        }
      }
    }
    ,setDataOfDepth : function() {
      var that = this;
      this.$elemTargets
        .each( function( index , elem ) {
          $( elem ).attr( 'data-rowheight-depth', 'null' );
        } )
        .each( function( index, elem ) {
          var len = $( elem ).parents( '[data-rowheight-depth]' ).length;
          $( elem ).attr( 'data-rowheight-depth', len );
          if ( len > that.maxDepth ) {
            that.maxDepth = len;
          }
        } );
    }
    ,destroy : function() {
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if ( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handle );
      }
      this.$elemTargets
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
      ;
      return this
        .$base
        .removeData( pluginName )
      ;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      plugin
      ,$elemTargets = this
      ,options
      ,children
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
      this.data(
        pluginName, Object.create( $[ pluginName ] ).init( $elemTargets, children, options )
      );
    }
    plugin = this.data( pluginName );
    if ( plugin[ arg1 ] ) {
      return plugin[ arg1 ].apply( plugin, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
        obj instanceof jQuery === false;
    }
  };
} )( jQuery, window );
