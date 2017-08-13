(function($){
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
  ,$list1 = $('#list1>li').rowHeight(options1)
  ,$list2 = $('#list2').find('>li,>li div').rowHeight(options2)
  ;

  $('#list1_i').on('click',function(){
    $list1.rowHeight(options1);
    return false;
  });
  $('#list2_i').on('click',function(){
    $list2.rowHeight(options2);
    return false;
  });
  $('#list1_d').on('click',function(){
    if($list1.data('rowHeight')){
      $list1.data('rowHeight').destroy();
    }
    return false;
  });
  $('#list2_d').on('click',function(){
    if($list2.data('rowHeight')){
      $list2.data('rowHeight').destroy().children('div').css('height','');
    }
    return false;
  });
})(jQuery);