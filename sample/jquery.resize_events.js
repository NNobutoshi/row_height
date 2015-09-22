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