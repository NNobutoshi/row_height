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
      ,bindType      : 'elementresize fontresize'
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
    ,$list1 = $('#list1>li').rowHeight( options1 )
    ,$list2 = $('#list2').rowHeight( '>li', options2 )
    ,$list3 = $('#list3').rowHeight( '>li', options3 )
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
    $list2.rowHeight('destroy').find('div').css( 'height', '' );
    return false;
  });
  $('#list3_i').on( 'click', function() {
    $list3.rowHeight( '>li>div', options3 );
    return false;
  });
  $('#list3_d').on( 'click', function() {
    $list3.rowHeight('destroy');
    return false;
  });

} )( jQuery );