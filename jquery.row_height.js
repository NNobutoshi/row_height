;(function($){
	var
	 pluginName = 'rowHeight'
	;
	$.fn[pluginName] = function(options) {
		var
		 options   = options || {}
		;
		if(!$[pluginName]){
			$[pluginName] = _extend();
		}
		this.data(pluginName,_inherit($[pluginName]).init(this,options));
		return this;
	};
	function _extend(){
		return {
			 timeoutId : 0
			,settings  : {
				 firstClassName : ''
				,delay          : 200
				,onComplete     : false
				,cssProp        : 'height'
			}
			,init : function($elements,options){
				var
				 that = this
				;
				this.settings = $.extend({},this.settings,options);
				this.handler = function(){
					clearTimeout(that.timeoutId);
					that.timeoutId = setTimeout(function(){
						that.run($elements);
					},that.settings.delay);
				};
				$(window)
				 .bind('blockresize',that.handler)
				 .trigger('blockresize',that.handler)
				;
				return this;
			}
			,run : function (elements,options){
				var
				 settings  = $.extend({},this.settings,options)
				,that      = this
				,heights   = []
				,$elements = (elements instanceof jQuery)?elements:$(elements)
				,arry      = this.getRow($elements,settings)
				,$slice    = arry[0]
				,$surplus  = arry[1]
				,len       = $slice.length;
				;

				$slice
				 .css(settings.cssProp,'')
				 .each(function(){
					var $this = $(this);
					heights.push($this.height());
				 })
				 .css(settings.cssProp,Math.max.apply(null,heights) + 'px')
				;
				setTimeout(function(){
					if($surplus.length){
						that.run($surplus,settings);
					}else{
						if(typeof settings.onComplete === 'function'){
							settings.onComplete();
						}
					}
				},1);
			}
			,getRow : function($elements,settings){
				var
				 firstOffsetTop = false
				,slicePoint     = 0
				;
				if(settings.firstClassName){
					$elements.removeClass(settings.firstClassName);
				}
				$elements
				 .each(function(i){
					var
					 $this         = $(this)
					,thisOffsetTop = $this.offset().top
					,data          = $this.data('defHeight')
					;
					if(firstOffsetTop === false){
						firstOffsetTop = thisOffsetTop;
						if(settings.firstClassName){
							$this.addClass(settings.firstClassName);
						}
					}else if(firstOffsetTop !== thisOffsetTop){
						return false;
					}
					slicePoint = i;
				 })
				;
				return [$elements.slice(0,slicePoint+1),$elements.slice(slicePoint+1)];
			}
			,destroy : function(){
				clearTimeout(this.timeoutId);
				$(window).unbind('blockresize',this.handler);
			}
		};
	};
	function _inherit(o) {
		if(Object.create){
			return Object.create(o);
		}
		var F = function(){};
		F.prototype = o;
		return new F();
	};
})(jQuery);


//=== blockresize-event ===
// via @ jney / jquery-textresize-event
// https://github.com/jney/jquery-textresize-event
//

;(function ($,window) {
  
var
	 interval = 200
	,FALSE = !1
	,CHILD = 'br-child'
	,WIDTH = 'br-width'
	,HEIGHT = 'br-height'
	,TIMER = 'br-timer'
;
var detect = function (element, child) {
	element.data(WIDTH, child.width());
	element.data(HEIGHT, child.height());
	return function () {
		if (element.data(WIDTH) !== child.width() || element.data(HEIGHT) !== child.height()) {
			element.data(WIDTH, child.width())
			 .data(HEIGHT, child.height())
			 .triggerHandler('blockresize')
			;
		}
	};
};

$.event.special.blockresize = {
	setup: function () {
		var
		 element = $(this)
		,child   = $('<span>&nbsp</span>')
		            .css({display:'block',top:'-9999px',position:'absolute',width:'100%'})
		            .appendTo(this == window ? 'body' : element)
		,timer   = window.setInterval(detect(element, child), interval)
		;
		element
		 .data(CHILD, child)
		 .data(TIMER, timer)
		;
		return FALSE;
	},
	teardown: function () {
		var element = $(this);
		window.clearInterval(element.data(TIMER));
		element.data(CHILD).remove();
		element
		 .removeData(CHILD)
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

