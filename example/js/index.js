/*!
* jQuery.resize_events
* version : 1.0.2
* link    : https://github.com/NNobutoshi/resize_events/
* License : MIT
*/

/*! elementresize  */
;(function($,window) {
  var
   eventName = 'elementresize'
  ,interval  = 200
  ;
  $.event.special[eventName] = {
    setup : function(){
      var
       $this = $(this)
      ;
      $this.data(eventName,{
         width  : $this.width()
        ,height : $this.height()
        ,timer  : window.setInterval(
          function(){
            var
             data   = $this.data(eventName)
            ,width  = $this.width()
            ,height = $this.height()
            ;
            if (
               data.width  !== width
            || data.height !== height
            ) {
              data.width  = width;
              data.height = height;
              $this.triggerHandler(eventName);
            }
          }
          ,interval
        )
      });
    }
    ,teardown : function(){
      var
       $this = $(this)
      ;
      window.clearInterval($this.data(eventName).timer);
      $this.removeData(eventName);
    }
  };

  $.fn[eventName] = function(data,fn){
    return arguments.length > 0
      ? this.bind(eventName,data,fn)
      : this.trigger(eventName)
      ;
  };

})(jQuery,window);

/*! fontresize  */
(function($){
  var
   className   = 'js-checker'
  ,eventName   = 'fontresize'
  ,triggerName = 'elementresize'
  ,$checker
  ;

  $.event.special[eventName] = {

    setup: function(){
      var
       $this    = $(this)
      ,$checker = $('<ins class="'+ className +'">&nbsp;</ins>')
        .css({
           display  : 'block'
          ,left     : '-9999px'
          ,position : 'absolute'
        })
        .prependTo(($.isWindow(this))?'body':this)
        .bind(triggerName,function(){
          $this.trigger(eventName);
        })
      ;

      $this.data(eventName,$checker);
    }
    ,teardown : function(){
      var
       $this = $(this)
      ;

      $this
        .data(eventName)
        .unbind(triggerName,function(){
          $this.trigger(eventName);
        })
        .remove()
      ;
    }
  };
  $.fn[eventName] = function(data,fn){
    return arguments.length > 0
      ? this.bind(eventName,data,fn)
      : this.trigger(eventName)
      ;
  };

})(jQuery);
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
    }
    ,init : function( $elements, children, options ) {
      var
         that = this
        ,settings
      ;
      settings = this.settings = $.extend( {}, this.settings, options );
      this.$elements = $elements;
      if( children ) {
        $elements = this.$children = $elements.find( children );
      }
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
      that.run( $elements, settings );
      return this;
    }
    ,run : function( elements, options ) {
      var
         that      = this
        ,settings
        ,$elements
        ,deferred
      ;
      if( elements instanceof jQuery ) {
        $elements = elements;
      } else if( elements ) {
        $elements = $( elements );
      }
      settings = $.extend( {}, this.settings, options );
      if( $.isFunction( settings.onBefore ) ) {
        settings.onBefore();
      }
      if( $elements ) {
        deferred = settings.deferred;
        this.align( $elements, settings, deferred );
      }
      return this;
    }
    ,align : function( $elements , settings, deferred ) {
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
          that.align( $ends, settings, deferred );
        }else{
          if( deferred ) {
            deferred.resolve();
            delete that.deferred;
          }
          if( $.isFunction( settings.onComplete ) ) {
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
      var $elements;
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handler );
      }
      delete this.deferred;
      if( this.$children ) {
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
        ,that     = this
      ;
      options = options || {};
      options.deferred = deferred;
      if( this.deferred ) {
        this.deferred.promise().then( function() {
          that.run( elements, options );
        } );
      } else {
        this.run( elements, options );
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
        return typeof obj === 'object' && ( obj.nodeType === undefined || obj.nodeType !== 1 ) && obj instanceof jQuery === false;
      }
    ;
    if( !this.data( pluginName ) ) {
      if ( $[ pluginName ][ arg1 ] ) {
        if( arg2 && arg3 ) {
          children = arg2;
          options = arg3;
        } else if( arg2 ) {
          if( _isOptions( arg2 ) ) {
            options = arg2;
          } else {
            children = arg2;
          }
        }
      } else {
        if( arg1 && arg2 ) {
          children = arg1;
          options = arg2;
        } else if( arg1 ) {
          if( _isOptions( arg1 ) ) {
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
    if( Object.create ) {
      return Object.create( o );
    }
    var F = function() {};
    F.prototype = o;
    return new F();
  }
} )( jQuery, window );
( function( $ ) {
  var
     options1 = {
       bindType : 'elementresize fontresize'
      ,firstClassName : 'js-first'
      ,lastClassName  : 'js-last'
     }
    ,options2 = {
       firstClassName : 'js-first'
      ,lastClassName  : 'js-last'
      ,bindType       : 'elementresize fontresize'
      ,onComplete     : function() {
        $.rowHeight
          .then( '#list2>li>div' )
          .then( '#list2>li>div>div' )
          .then( '#list2>li>div' )
          .then( '#list2>li' )
        ;
      }
    }
    ,$list1 = $('#list1>li').rowHeight( options1 )
    ,$list2 = $('#list2').rowHeight( '>li', options2 )
  ;
  $('#list1_i').on( 'click', function() {
    $list1.rowHeight( options1 );
    return false;
  });
  $('#list1_d').on( 'click', function() {
    $list1.rowHeight('destroy');
    return false;
  });
  $('#list2_i').on( 'click', function() {
    $list2.rowHeight( '>li', options2 );
    return false;
  });
  $('#list2_d').on( 'click', function() {
    $list2.rowHeight('destroy').children('div').css( 'height', '' );
    return false;
  });

} )( jQuery );
//# sourceMappingURL=index.js.map
