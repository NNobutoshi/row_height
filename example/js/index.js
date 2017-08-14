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

;( function( $, window, undefined ){
  'use strict';
  var
    pluginName = 'rowHeight'
  ;
  $[ pluginName ] = {
     $elements : null
    ,timeoutId : null
    ,handler   : undefined
    ,settings  : {
       firstClassName : ''
      ,lastClassName  : ''
      ,delay          : 200
      ,onBefore       : undefined
      ,onComplete     : undefined
      ,cssProp        : 'height'
      ,bindType       : ''
      ,bindObj        : window
      ,forEachRow     : true
    }
    ,init : function( $elements, target, options ){
      var
         that = this
        ,settings
      ;
      if( typeof target === 'object' && options === undefined ){
        options = target;
      }
      settings = this.settings = $.extend( {}, this.settings, options );
      this.$elements = $elements;
      this.run( $elements, target, settings );
      if( settings.bindType ){
        this.handler = function() {
          clearTimeout( that.timeoutId );
          that.timeoutId = setTimeout( function(){
            that.run( $elements, target, settings );
          }, settings.delay );
        };
        $( settings.bindObj )
          .on( settings.bindType, this.handler )
        ;
      }
      return this;
    }
    ,run : function( elements, target, options, flag ){
      var
         that      = this
        ,settings
        ,heights   = []
        ,$elements
        ,paired$
        ,$targets
        ,$ends
      ;
      if( !elements ){
        $elements = this.$elements;
      }else{
        $elements = ( elements instanceof jQuery )? elements: $( elements );
      }
      if( !$elements ){
        return this;
      }
      if( typeof target === 'string' ){
        $elements = $elements.find( target );
      }
      if( typeof target === 'object' ){
        options = target;
      }
      settings = $.extend( {}, this.settings, options );
      if( !flag && $.isFunction( settings.onBefore ) ){
        settings.onBefore();
      }
      if( settings.forEachRow === true ){
        paired$ = this.getRow( $elements );
        $targets = paired$[0];
        $ends  = paired$[1];
      }else if( settings.forEachRow === false ){
        $targets = $elements;
      }
      $targets
        .css( settings.cssProp, '' )
        .each( function( index ){
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
            if( index === $targets.length - 1 ){
              $this.addClass( settings.lastClassName );
            }else {
              $this.removeClass( settings.lastClassName );
            }
          }
        })
        .css( settings.cssProp, Math.max.apply( null, heights ) + 'px' )
      ;
      setTimeout( function(){
        if( $ends && $ends.length ){
          that.run( $ends, undefined, settings, 1 );
        }else{
          if( $.isFunction( settings.onComplete ) ){
            settings.onComplete();
          }
        }
      },1 );
      return this;
    }
    ,getRow : function( $targets ){
      var
         firstOffsetTop
        ,$firstRowGroup
        ,$ends
      ;
      $targets
        .each( function( index ){
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
    ,destroy : function(){
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if( this.settings.bindType ){
        $( this.settings.bindObj ).off( this.settings.bindType, this.handler );
      }
      return this
        .$elements
        .removeData( pluginName )
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
      ;
    }
  };
  $.fn[ pluginName ] = function( arg, options ){
    var thisData = this.data( pluginName );
    if( thisData ) {
      if( thisData[ arg ] ) {
        return thisData[ arg ].apply( thisData, Array.prototype.slice.call( arguments, 1 ) );
      }
    } else if ( !$[ pluginName ][ arg ] ) {
      this.data( pluginName, _inherit( $[ pluginName ] ).init( this, arg, options ) );
    }
    return this;
  };
  function _inherit( o ){
    if( Object.create ){
      return Object.create( o );
    }
    var F = function(){};
    F.prototype = o;
    return new F();
  }
} )( jQuery, window );
( function( $ ){
  var
     options1 = {
       bindType :'elementresize fontresize'
     }
    ,options2 = {
       bindType       :'elementresize fontresize'
      ,firstClassName : 'js-first'
      ,lastClassName  : 'js-last'
      ,onComplete     : function(){
        $.rowHeight.run('#list2>li');
      }
    }
    ,$list1 = $('#list1>li').rowHeight( options1 )
    ,$list2 = $('#list2').find('>li,>li div').rowHeight( options2 )
  ;

  $('#list1_i').on( 'click', function(){
    $list1.rowHeight( options1 );
    return false;
  });
  $('#list2_i').on( 'click', function(){
    $list2.rowHeight( options2 );
    return false;
  });
  $('#list1_d').on( 'click', function(){
    $list1.rowHeight('destroy');
    return false;
  });
  $('#list2_d').on( 'click', function(){
    $list2.rowHeight('destroy').children('div').css( 'height', '' );
    return false;
  });
} )( jQuery );
//# sourceMappingURL=index.js.map
