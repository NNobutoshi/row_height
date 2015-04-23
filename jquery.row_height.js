/*!
* License: MIT
*/
;(function($,window,undefined){
	var
	 pluginName = 'rowHeight'
	;
	$.fn[pluginName] = function(options) {
		var
		 master = $[pluginName]
		;
		if(!master){
			master = $[pluginName] = _createMaster();
		}
		if(this.length && !this.data(pluginName)){
			this.data(pluginName,_inherit(master).init(this,options));
		}
		return this;
	};
	function _createMaster(){
		return {
			 $elements : null
			,timeoutId : 0
			,handler   : undefined
			,settings  : {
				 firstClassName : ''
				,lastClassName  : ''
				,delay          : 200
				,onBefore       : undefined
				,onComplete     : undefined
				,cssProp        : 'height'
				,bindType       : ''
				,bindObj        : window
				,forEachRow     : true
			 }
			,init : function($elements,options){
				var
				 that     = this
				,settings = $.extend({},this.settings,options)
				;
				this.settings  = settings;
				this.$elements = $elements;
				this.run($elements,settings);
				if(settings.bindType){
					this.handler = function(){
						clearTimeout(that.timeoutId);
						that.timeoutId = setTimeout(function(){
							that.run(that.$elements,settings);
						},settings.delay);
					};
					$(settings.bindObj)
					 .bind(settings.bindType,that.handler)
					;
				}
				return this;
			 }
			,run : function (elements,options,flag){
				var
				 that      = this
				,settings  = $.extend({},this.settings,options)
				,heights   = []
				,$elements = (elements instanceof jQuery)?elements:$(elements)
				,rows      = this.getRow($elements,settings.firstClassName)
				,$slice
				,$ends
				;
				if(!flag && $.isFunction(settings.onBefore)){
					settings.onBefore.call();
				}
				if(settings.forEachRow === true){
					$slice = rows[0];
					$ends  = rows[1];
				}else if(settings.forEachRow === false){
					$slice = $elements;
				}

				$slice
				 .css(settings.cssProp,'')
				 .each(function(i){
					var
					 $this   = $(this)
					,boxType = $this.css('boxSizing')
					;
					if(boxType === 'border-box') {
						heights.push($this.outerHeight());
					}else{
						heights.push($this.height());
					}
					if(settings.firstClassName){
						if(i === 0) {
							$this.addClass(settings.firstClassName);
						}else{
							$this.removeClass(settings.firstClassName);
						}
					}
					if(settings.lastClassName){
						if(i === $slice.length-1){
							$this.addClass(settings.lastClassName);
						}else {
							$this.removeClass(settings.lastClassName);
						}
					}
				 })
				 .css(settings.cssProp,Math.max.apply(null,heights) + 'px')
				;
				setTimeout(function(){
					if($ends && $ends.length){
						that.run($ends,settings,1);
					}else{
						if($.isFunction(settings.onComplete)){
							settings.onComplete.call();
						}
					}
				},1)
				;
			 }
			,getRow : function($elements){
				var
				 firstOffsetTop = false
				,slicePoint     = 0
				;
				$elements
				 .each(function(i){
					var
					 $this         = $(this)
					,thisOffsetTop = $this.offset().top
					;
					if(firstOffsetTop === false){
						firstOffsetTop = thisOffsetTop;
					}else if(firstOffsetTop !== thisOffsetTop){
						return false;
					}
					slicePoint = i;
				 })
				;
				return [
					 $elements.slice(0,slicePoint+1)
					,$elements.slice(slicePoint+1)
				]
				;
			 }
			,destroy : function(){
				clearTimeout(this.timeoutId);
				if(this.settings.bindType){
					$(this.settings.bindObj).unbind(this.settings.bindType,this.handler);
				}
				this
				 .$elements
				 .removeData(pluginName)
				 .css(this.settings.cssProp,'')
				 .removeClass(this.settings.firstClassName)
				 .removeClass(this.settings.lastClassName)
				;
			}
		};
	}
	function _inherit(o) {
		if(Object.create){
			return Object.create(o);
		}
		var F = function(){};
		F.prototype = o;
		return new F();
	}
})(jQuery,window);