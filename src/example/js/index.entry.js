import jQuery from 'jquery';

import '../../js/jquery.row_height.js';
import '../../js/jquery.resize_events.js';

( function( $ ) {
  var
    options1 = {
      bindType        : 'elementresize fontresize'
      ,firstClassName : 'js-first-element'
      ,lastClassName  : 'js-last-element'
    }
    ,options2 = {
      firstClassName : 'js-firstelement'
      ,lastClassName : 'js-last-element'
      ,bindType : 'elementresize fontresize'
    }
    ,options3 = {
      bindType : 'elementresize fontresize'
      ,firstClassName : 'js-first-element'
      ,lastClassName : 'js-last-element'
      ,onComplete : function( $base ) {
        $base.addClass( 'js-complete' );
      }
    }
    ,$list1 = $( '#list1>li' )
    ,$list2 = $( '#list2' )
    ,$list3 = $( '#list3' )
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
      $list3.rowHeight( '>li,>li>div', options3 );
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
