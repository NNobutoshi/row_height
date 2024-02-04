/*!
* jQuery.row_height
* version : 4.0.0
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
    $elemBase : $( document )
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
      ,isBaseEqualTarget   : false
    }
    ,init : function( elements, children, options ) {
      var
        that = this
        ,settings = this.settings = $.extend( {}, this.settings, options )
      ;
      this.$elemBase = ( elements instanceof $ ) ? elements : $( elements );
      if (
        children instanceof $ === true ||
        children instanceof HTMLElement === true ||
        typeof children === 'string'
      ) {
        this.$elemTargets = this.$elemBase.find( children );
      } else {
        this.$elemTargets = this.$elemBase;
        this.isBaseEqualTarget = true;
      }
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
          .on( settings.eventType, that.handle )
        ;
      }
      this.run( this.$elemTargets );
      return this;
    }
    ,run: function( elements, options ) {
      var
        that = this
        ,$initialTargets
        ,settings = $.extend( {}, this.settings, options )
        ,startTime = undefined
      ;
      if ( !elements && this.$elemTargets && this.$elemTargets.length > 0 ) {
        if ( this.isBaseEqualTarget === true ) {
          $initialTargets = this.$elemBase;
        } else {
          $initialTargets = this.$elemTargets;
        }
      } else if ( elements instanceof $ === true ) {
        $initialTargets = elements;
      } else if ( !this.$elemTargets ) {
        $initialTargets = this.$elemBase;
      } else {
        $initialTargets = this.$elemBase.find( elements );
      }
      if ( $initialTargets.length === 0 ) {
        return this;
      }
      if ( typeof settings.onBefore === 'function' ) {
        settings.onBefore.call( this );
      }
      this.setDataOfDepth( $initialTargets );
      if ( settings.isTargetAll === true ) {
        this.setMaxHeight( $initialTargets, settings );
        return this;
      }
      ( function _setMaxHeightForEachRow( $elements ) {
        requestAnimationFrame( function( time ) {
          if ( startTime === undefined ) {
            startTime = time;
          }
          if ( time - startTime > settings.settingHeightDelay ) {
            $elements = that.getElementsOnFirstRow( $elements );
            if ( $elements.length > 0 ) {
              that.setMaxHeight( $elements, settings );
              $initialTargets = $initialTargets.not( $elements );
              _setMaxHeightForEachRow( $initialTargets );
            } else {
              if ( typeof settings.onComplete === 'function' ) {
                settings.onComplete.call( that );
              }
            }
          } else {
            _setMaxHeightForEachRow( $elements );
          }
        } );
      } )( $initialTargets );
      return this;
    }
    ,setMaxHeight: function( elements, options ) {
      var
        heightData = []
        ,$elements = ( elements instanceof $ === true ) ?
          elements : this.$elemBase.find( elements )
        ,settings = $.extend( {}, this.settings, options )
      ;
      if ( $elements.length === 0 ) {
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
    ,getElementsOnFirstRow: function( elements ) {
      var
        $elemSelected = $()
        ,$elements = ( elements instanceof $ === true ) ?
          elements : this.$elemBase.find( elements )
      ;
      if ( $elements && $elements.length === 0 ) {
        return this;
      }
      return ( function _selectElementsOnFirstRow( $elements ) {
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
              $elemSelected = $();
            }
            if ( posY === minPosY && depth === maxDepth ) {
              $elemSelected = $.merge( $elemSelected, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } )
        ;
        if ( hasChildInLine === true ) {
          return _selectElementsOnFirstRow( $elements.not( $elemSelected ) );
        } else {
          return $elemSelected;
        }
      } )( $elements );
    }
    ,setDataOfDepth : function( elements ) {
      var
        maxDepth = -1
        ,$elements = ( elements instanceof $ === true ) ?
          elements : this.$elemBase.find( elements )
      ;
      if ( $elements.length === 0 ) {
        return this;
      }
      $elements
        .each( function( index , elem ) {
          $( elem ).attr( 'data-rowheight-depth', 'null' );
        } )
        .each( function( index, elem ) {
          var len = $( elem ).parents( '[data-rowheight-depth]' ).length;
          $( elem ).attr( 'data-rowheight-depth', len );
          if ( len > maxDepth ) {
            maxDepth = len;
          }
        } )
      ;
    }
    ,destroy : function( elements ) {
      var $elements;
      if ( !elements && this.$elemTargets && this.$elemTargets.length > 0 ) {
        if ( this.isBaseEqualTarget === true ) {
          $elements = this.$elemBase;
        } else {
          $elements = this.$elemTargets;
        }
      } else if ( elements instanceof $ === true ) {
        $elements = elements;
      } else {
        $elements = this.$elemBase.find( elements );
      }
      if ( $elements.length === 0 ) {
        return this;
      }
      cancelAnimationFrame( this.rafId );
      this.rafId = null;
      if ( this.settings.eventType ) {
        $( this.settings.eventObj ).off( this.settings.eventType, this.handle );
      }
      $elements
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstOfRowClassName )
        .removeClass( this.settings.lastOfRowClassName )
      ;
      if ( this.$elemBase && this.$elemBase.length > 0 ) {
        return this
          .$elemBase
          .removeData( pluginName )
        ;
      }
      return $elements;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      plugin = this.data( pluginName ) || Object.create( $[ pluginName ] )
      ,children
      ,options
    ;
    plugin.$elemBase = this;
    if ( plugin[ arg1 ] ) {
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
      plugin[ arg1 ].call( plugin, children, options );
      if ( arg1 !== 'destroy' ) {
        this.data( pluginName, plugin );
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
      this.data( pluginName, plugin.init( this, children, options ) );
    }
    return plugin;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== Node.ELEMENT_NODE ) &&
        obj instanceof $ === false;
    }
  };
} )( jQuery, window );
