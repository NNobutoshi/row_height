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