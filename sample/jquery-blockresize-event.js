//=== blockresize-event ===
// via @ jney / jquery-textresize-event
// https://github.com/jney/jquery-textresize-event
//

;(function ($,window) {
  
var
	 interval = 200
	,FALSE = !1
	,WIDTH = 'br-width'
	,HEIGHT = 'br-height'
	,TIMER = 'br-timer'
;
var detect = function (element) {
	element.data(WIDTH, element.width());
	element.data(HEIGHT, element.height());
	return function () {
		if (element.data(WIDTH) !== element.width() || element.data(HEIGHT) !== element.height()) {
			element.data(WIDTH, element.width())
			 .data(HEIGHT, element.height())
			 .triggerHandler('blockresize')
			;
		}
	};
};

$.event.special.blockresize = {
	setup: function () {
		var
		 element = $(this)
		,timer   = window.setInterval(detect(element), interval)
		;
		element.data(TIMER, timer);
		return FALSE;
	},
	teardown: function () {
		var element = $(this);
		window.clearInterval(element.data(TIMER));
		element
		 .removeData(WIDTH)
		 .removeData(HEIGHT)
		 .removeData(TIMER)
		;
		return FALSE;
	}
};

$.fn.blockresize = function (fn) { 
	$(this).bind('blockresize', fn);
	return this;
};

})(jQuery,window);

