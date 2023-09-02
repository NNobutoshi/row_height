import jQuery from 'jquery';

import '../../js/jquery.row_height.js';
import '../../js/jquery.resize_events.js';

( function( $ ) {
  var
    options1 = {
      bindType        : 'elementresize fontresize'
      ,firstClassName : 'js-first'
      ,lastClassName  : 'js-last'
    }
    ,options2 = {
      firstClassName : 'js-first'
      ,lastClassName : 'js-last'
      // ,bindType : 'elementresize fontresize'
      ,bindType : 'elementresize'
      ,onComplete    : function() {
        $.rowHeight
          .then( '#list2>li>div' )
          .then( '#list2>li>div>div' )
          .then( '#list2>li>div' )
          .then( '#list2>li' )
        ;
      }
    }
    ,options3 = {
      bindType : 'elementresize fontresize'
      ,onComplete : function() {
        $.rowHeight
          .then( '#list3>li>div' )
          .then( '#list3>li' )
        ;
      }
    }
    ,$list1 = $( '#list1>li' )
    ,$list2 = $( '#list2>li,#list2>li>div,#list2>li>div>div' )
    // ,$list2 = $( '#list2>li' )
    ,$list3 = $( '#list3>li, #list3>li>div' )
  ;
  $( '#list1_i' )
    .on( 'click', function() {
      $list1.rowHeight( options1 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list1_d' )
    .on( 'click', function() {
      $list1.rowHeight( 'destroy' );
      return false;
    } )
  ;
  $( '#list2_i' )
    .on( 'click', function() {
      $list2.rowHeight( options2 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list2_d' )
    .on( 'click', function() {
      $list2.rowHeight( 'destroy' ).find( 'div' ).css( 'height', '' );
      return false;
    } )
  ;
  $( '#list3_i' )
    .on( 'click', function() {
      $list3.rowHeight( options3 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list3_d' )
    .on( 'click', function() {
      $list3.rowHeight( 'destroy' ).find( 'div' ).css( 'height', '' );
      return false;
    } )
  ;

} )( jQuery );
