import jQuery from 'jquery';

import '../../js/jquery.row_height.js';
import '../../js/jquery.resize_events.js';

( function( $ ) {
  var
    $list1 = $( '#list1>li' )
    ,$list2 = $( '#list2' )
    ,$list3 = $( '#list3' )
    ,options1 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
    }
    ,options2 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
    }
    ,options3 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
      onComplete          : function() {
        this.$elemBase.addClass( 'js-complete' );
      },
    }
  ;
  $( '#list1_r' )
    .on( 'click', function() {
      $list1.rowHeight( options1 );
      return false;
    } )
  ;
  $( '#list1_d' )
    .on( 'click', function() {
      $list1.rowHeight( 'destroy' );
      return false;
    } )
  ;
  $( '#list2_r' )
    .on( 'click', function() {
      $list2.rowHeight( '>li,>li>div,>li>div>div', options2 );
      return false;
    } )
  ;
  $( '#list2_d' )
    .on( 'click', function() {
      $list2.rowHeight( 'destroy' );
      return false;
    } )
  ;
  $( '#list3_r' )
    .on( 'click', function() {
      $list3.rowHeight( '>li,>li>div,>li>div>div', options3 );
      return false;
    } )
  ;
  $( '#list3_d' )
    .on( 'click', function() {
      $list3.rowHeight( 'destroy' );
      $list3.removeClass( 'js-complete' );
      return false;
    } )
  ;

} )( jQuery );
