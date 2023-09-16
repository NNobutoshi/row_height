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
    ,rafId : null
    ,handle    : null
    ,settings  : {
      firstOfRowClassName  : ''
      ,lastOfRowClassName  : ''
      ,eventDelay          : 160
      ,settingHeightDelay  : 16
      ,onBefore            : null
      ,onComplete          : null
      ,cssProp             : 'height'
      ,eventType           : ''
      ,eventObj            : window
      ,isTargetAll         : false
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
      this.handle = function( e ) {
        var startTime = undefined;
        cancelAnimationFrame( that.rafId );
        ( function _handle() {
          that.rafId = requestAnimationFrame( function( time ) {
            if ( startTime === undefined ) {
              startTime = time;
            }
            if ( time - startTime > that.settings.eventDelay ) {
              that.run( that.$elemTargets );
            } else {
              _handle();
            }
          } );
        } )();
      };
      if ( settings.eventType ) {
        $( settings.eventObj )
          .on( settings.eventType, function( e ) {
            that.handle( e );
          } )
        ;
      }
      this.run( this.$elemTargets );
      return this;
    }
    ,run: function( $elements, options ) {
      var
        $initialTargets = $elements
        ,that = this
        ,settings = this.settings = $.extend( {}, this.settings, options )
        ,startTime = undefined
      ;
      this.setDataOfDepth( $initialTargets );
      if ( settings.isTargetAll === true ) {
        this.setMaxHeigth( $initialTargets );
        return this;
      }
      ( function _setMaxHeightForEachRow( $elements ) {
        requestAnimationFrame( function( time ) {
          if ( startTime === undefined ) {
            startTime = time;
          }
          if ( time - startTime > settings.settingHeightDelay ) {
            $elements = that.get1stTargetRow( $elements );
            that.setMaxHeigth( $elements );
            if ( $elements.length > 0 ) {
              $initialTargets = $initialTargets.not( $elements );
              _setMaxHeightForEachRow( $initialTargets );
            } else {
              if ( typeof settings.onComplete === 'function' ) {
                settings.onComplete( that.$base );
              }
            }
          } else {
            _setMaxHeightForEachRow( $elements );
          }
        } );
      } )( $initialTargets );
      return this;
    }
    ,setMaxHeigth: function( $elements ) {
      var
        heightData = []
        ,settings = this.settings
      ;
      if ( $elements && $elements.length === 0 ) {
        return this;
      }
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
          if ( settings.firstOfRowClassName ) {
            if ( index === 0 ) {
              $elem.addClass( settings.firstOfRowClassName );
            } else {
              $elem.removeClass( settings.firstOfRowClassName );
            }
          }
          if ( settings.lastOfRowClassName ) {
            if ( index === $elements.length - 1 ) {
              $elem.addClass( settings.lastOfRowClassName );
            } else {
              $elem.removeClass( settings.lastOfRowClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
      ;
      return this;
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
    ,setDataOfDepth : function( $elemTargets ) {
      var that = this;
      $elemTargets
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
      cancelAnimationFrame( this.rafId );
      this.rafId = null;
      if ( this.settings.eventType ) {
        $( this.settings.eventObj ).off( this.settings.eventType, this.handle );
      }
      this.$elemTargets
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstOfRowClassName )
        .removeClass( this.settings.lastOfRowClassName )
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
      ,children
      ,options
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
      if ( !$[ pluginName ][ arg1 ] ) {
        this.data(
          pluginName, Object.create( $[ pluginName ] ).init( $elemTargets, children, options )
        );
      }
    }
    plugin = this.data( pluginName );
    if ( plugin && plugin[ arg1 ] ) {
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
