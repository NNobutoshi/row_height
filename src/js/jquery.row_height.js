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
    $elemTargets  : null
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
      var settings = this.settings = $.extend( {}, this.settings, options );
      var that = this;
      if ( children ) {
        $elemTargets = $elemTargets.find( children );
      }
      this.$elemTargets = $elemTargets;
      this.handle = function() {
        clearTimeout( that.timeoutId );
        that.timeoutId = setTimeout( function() {
          that.run( that.$elemTargets, that.settings );
        }, that.settings.delay );
      };
      if ( settings.bindType ) {
        $( settings.bindObj )
          .on( settings.bindType, this.handle )
        ;
      }
      // this.run( $elemTargets, options );
      this.setDataOfDepth();
      this.setMaxHeigthOnRow( this.$elemTargets );
      return this;
    }
    ,setMaxHeigthOnRow: function( $elements ) {
      var
        heightData = []
        ,settings = this.settings
      ;
      $elements = this.get1stTargetRow( $elements );
      $elements
        .css( settings.cssProp, '' )
        .each( function( index ) {
          var
            $this    = $( this )
            ,boxType = $this.css( 'boxSizing' )
          ;
          if ( boxType === 'border-box' ) {
            heightData[ heightData.length ] = $this.outerHeight();
          } else {
            heightData[ heightData.length ] = $this.height();
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
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
        .css( 'border','solid 3px #f0f' )
      ;
    }
    ,get1stTargetRow: function() {
      var $rowGroup = $();
      _getRowGroup( this.$elemTargets );
      return $rowGroup;
      function _getRowGroup( $elemTargets ) {
        var
          minPosY = Infinity
          ,hasChildInLine = false
          ,maxDepth = -1
        ;
        $elemTargets
          .each( function( index ,elem ) {
            var
              $elem = $( elem )
              ,posY = $elem.position().top
              ,depth = parseInt( $elem.attr( 'data-rowheight-depth' ) )
            ;
            if ( posY < minPosY || ( posY === minPosY && depth > maxDepth ) ) {
              hasChildInLine = false;
              maxDepth = depth;
              minPosY = posY;
              $rowGroup = $();
            }
            if ( posY === minPosY && maxDepth === depth ) {
              $rowGroup = $.merge( $rowGroup, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } );
        if ( hasChildInLine === true ) {
          _getRowGroup( $elemTargets.not( $rowGroup ) );
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
    ,run : function( elements, options, deferred ) {
      var
        settings
        ,$elemTargets
      ;
      if ( elements instanceof jQuery ) {
        $elemTargets = elements;
      } else if ( elements ) {
        $elemTargets = $( elements );
      }
      settings = $.extend( {}, this.settings, options );
      if ( typeof settings.onBefore === 'function' ) {
        settings.onBefore();
      }
      if ( $elemTargets ) {
        this.align( $elemTargets, settings, deferred );
      }
      return this;
    }
    ,align : function( $elemTargets , settings, deferred ) {
      var
        that     = this
        ,heights = []
        ,paired$
        ,$ends
      ;
      if ( settings.forEachRow === true ) {
        paired$ = this.getRow( $elemTargets );
        $elemTargets = paired$[ 0 ];
        $ends  = paired$[ 1 ];
      }
      $elemTargets
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
            if ( index === $elemTargets.length - 1 ) {
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
          if ( typeof settings.onComplete === 'function' ) {
            settings.onComplete();
          }
        }
      }, 1 );
    }
    ,getRow : function( $elemTargets ) {
      var
        firstOffsetTop
        ,$firstRowGroup
        ,$ends
      ;
      $elemTargets
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
      console.info( 'click destrory' );
      var $elemTargets;
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if ( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handle );
      }
      delete this.deferred;
      if ( this.$children ) {
        $elemTargets = this.$children;
      } else {
        $elemTargets = this.$elemTargets;
      }
      $elemTargets
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
      ;
      return this
        .$elemTargets
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
      this.data( pluginName, _inherit( $[ pluginName ] ).init( $elemTargets, children, options ) );
    }
    rowHeight = this.data( pluginName );
    if ( rowHeight[ arg1 ] ) {
      return rowHeight[ arg1 ].apply( rowHeight, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
        obj instanceof jQuery === false;
    }
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
