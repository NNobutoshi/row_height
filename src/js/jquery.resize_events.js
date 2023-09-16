/*!
* jQuery.resize_events
* version : 1.0.2
* link    : https://github.com/NNobutoshi/resize_events/
* License : MIT
*/

import jQuery from 'jquery';

/*! elementresize  */
( function( $, window ) {
  var
    eventName  = 'elementresize'
    ,interval  = 200
  ;
  $.event.special[ eventName ] = {
    setup : function() {
      var
        $this = $( this )
      ;
      $this.data( eventName, {
        width   : $this.width()
        ,height : $this.height()
        ,timer  : window.setInterval( function() {
          var
            data    = $this.data( eventName )
            ,width  = $this.width()
            ,height = $this.height()
          ;
          if (
            data.width  !== width || data.height !== height
          ) {
            data.width  = width;
            data.height = height;
            $this.triggerHandler( eventName );
          }
        }, interval )
      } );
    }
    ,teardown : function() {
      var
        $this = $( this )
      ;
      window.clearInterval( $this.data( eventName ).timer );
      $this.removeData( eventName );
    }
  };

  $.fn[ eventName ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( eventName, data, fn ) :
      this.trigger( eventName )
    ;
  };

} )( jQuery, window );

/*! fontresize  */
( function( $ ) {
  var
    className    = 'js-resizechecker'
    ,eventName   = 'fontresize'
    ,triggerName = 'elementresize'
  ;

  $.event.special[ eventName ] = {

    setup: function() {
      var
        $this    = $( this )
        ,$checker = $( '<ins class="' + className + '">&nbsp;</ins>' )
          .css( {
            display   : 'block'
            ,left     : '-9999px'
            ,position : 'absolute'
          } )
          .prependTo( ( this != null && this === this.window ) ? 'body' : this )
          .on( triggerName, function() {
            $this.trigger( eventName );
          } )
      ;

      $this.data( eventName, $checker );
    }
    ,teardown : function() {
      var
        $this = $( this )
      ;

      $this
        .data( eventName )
        .off( triggerName, function() {
          $this.trigger( eventName );
        } )
        .remove()
      ;
    }
  };
  $.fn[ eventName ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( eventName, data, fn ) :
      this.trigger( eventName )
    ;
  };

} )( jQuery );
