/*!
* jQuery.row_height
* version : 2.0.1
* link    : https://github.com/NNobutoshi/row_height/
* License : MIT
*/

;( function( $, window, undefined ) {
  'use strict';
  var
    pluginName = 'rowHeight'
  ;
  $[ pluginName ] = {
     $elements : null
    ,timeoutId : null
    ,handler   : null
    ,settings  : {
       firstClassName : ''
      ,lastClassName  : ''
      ,delay          : 200
      ,onBefore       : null
      ,onComplete     : null
      ,cssProp        : 'height'
      ,bindType       : ''
      ,bindObj        : window
      ,forEachRow     : true
      ,children       : null
    }
    ,init : function( $elements, options ) {
      var
         that = this
        ,settings
      ;
      settings = this.settings = $.extend( {}, this.settings, options );
      this.$elements = $elements;
      if( settings.bindType ) {
        this.handler = function() {
          clearTimeout( that.timeoutId );
          that.timeoutId = setTimeout( function(){
            that.run( $elements, settings );
          }, settings.delay );
        };
        $( settings.bindObj )
          .on( settings.bindType, this.handler )
        ;
      }
      return this;
    }
    ,run : function( elements, options ) {
      var
         that      = this
        ,settings
        ,$elements
        ,deferred
      ;
      if( typeof elements === 'string' ) {
        $elements = $( elements );
      }else if( elements instanceof jQuery ) {
        $elements = elements;
      } else if( typeof elements === 'object' ) {
        $elements = this.$elements;
        options = elements;
      } else {
        $elements = this.$elements;
      }
      if( $elements === null ) {
        return this;
      }
      settings = $.extend( {}, this.settings, options );
      if( settings.children ){
        $elements = $elements.find( settings.children );
      }
      if( $.isFunction( settings.onBefore ) ) {
        settings.onBefore();
      }
      deferred = settings.deferred;
      this.alignHeights( $elements, settings, deferred );
      return this;
    }
    ,alignHeights : function( $elements , settings, deferred ) {
      var
         that      = this
        ,heights   = []
        ,paired$
        ,$ends
      ;
      if( settings.forEachRow === true ) {
        paired$ = this.getRow( $elements );
        $elements = paired$[0];
        $ends  = paired$[1];
      }else if( settings.forEachRow === false ) {
        $targets = $elements;
      }
      $elements
        .css( settings.cssProp, '' )
        .each( function( index ) {
          var
             $this   = $( this )
            ,boxType = $this.css('boxSizing')
          ;
          if( boxType === 'border-box' ) {
            heights[ heights.length ] = $this.outerHeight();
          }else{
            heights[ heights.length ] = $this.height();
          }
          if( settings.firstClassName ){
            if( index === 0 ){
              $this.addClass( settings.firstClassName );
            }else{
              $this.removeClass( settings.firstClassName );
            }
          }
          if( settings.lastClassName ){
            if( index === $elements.length - 1 ){
              $this.addClass( settings.lastClassName );
            }else {
              $this.removeClass( settings.lastClassName );
            }
          }
        })
        .css( settings.cssProp, Math.max.apply( null, heights ) + 'px' )
      ;
      setTimeout( function() {
        if( $ends && $ends.length ){
          settings.children = null;
          that.alignHeights( $ends, settings, deferred );
        }else{
          if( deferred ) {
            deferred.resolve();
          }
          if( $.isFunction( settings.onComplete ) ) {
            settings.onComplete();
          }
        }
      }, 1 );
    }
    ,getRow : function( $targets ) {
      var
         firstOffsetTop
        ,$firstRowGroup
        ,$ends
      ;
      $targets
        .each( function( index ) {
          var
             $this         = $(this)
            ,thisOffsetTop = $this.offset().top
          ;
          if( index === 0 ){
            firstOffsetTop = thisOffsetTop;
          }
          if( firstOffsetTop === thisOffsetTop ){
            if( !$firstRowGroup ){
              $firstRowGroup = $this;
            } else {
              $.merge( $firstRowGroup, $this );
            }
          } else {
            if( !$ends ) {
              $ends = $this;
            } else {
              $.merge( $ends, $this );
            }
          }
        })
      ;
      return [ $firstRowGroup, $ends ];
    }
    ,destroy : function() {
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handler );
      }
      if( this.settings.children ) {
        this
          .$elements
          .find( this.settings.children )
          .css( this.settings.cssProp, '' )
          .removeClass( this.settings.firstClassName )
          .removeClass( this.settings.lastClassName )
        ;
      }
      return this
        .$elements
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
        .removeData( pluginName )
      ;
    }
    ,when: function( elements, options ) {
      var
         deferred = $.Deferred()
        ,settings
      ;
      if( typeof elements === 'object' ) {
        options = elements;
        elements = null;
      }
      settings = $.extend( {}, this.settings, options );
      settings.deferred = deferred;
      this.run( elements, settings );
      this.deferred = deferred;
      return this;
    }
    ,then: function( elements, options ) {
      var
         deferred = $.Deferred()
        ,settings
        ,that     = this
      ;
      if( typeof elements === 'object' ) {
        options = elements;
        elements = null;
      }
      settings = $.extend( {}, this.settings, options );
      settings.deferred = deferred;
      this.deferred.promise().then( function() {
        that.run( elements, settings );
      } );
      this.deferred = deferred;
      return this;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
       rowHeight
      ,$elements = this
      ,options
    ;
    if( !this.data( pluginName ) ) {
      if ( $[ pluginName ][ arg1 ] ) {
        if( typeof arg2 === 'string' ) {
          options = arg3;
        } else {
          options = arg2;
        }
      } else {
        if( typeof arg1 === 'string' ) {
          options = arg2;
        } else {
          options = arg1;
        }
      }
      this.data( pluginName, _inherit( $[ pluginName ] ).init( $elements, options ) );
    }
    rowHeight = this.data( pluginName );
    if ( rowHeight[ arg1 ] ) {
      return rowHeight[ arg1 ].apply( rowHeight, Array.prototype.slice.call( arguments, 1 ) );
    } else {
      options = arg1;
      rowHeight.run( this, options );
    }
    return this;
  };
  function _inherit( o ) {
    if( Object.create ) {
      return Object.create( o );
    }
    var F = function(){};
    F.prototype = o;
    return new F();
  }
} )( jQuery, window );