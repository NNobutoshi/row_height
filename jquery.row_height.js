;(function($,window){
	var
	 pluginName = 'rowHeight'
	;
	$.fn[pluginName] = function(options) {
		var
		 options = options || {}
		,master  = $[pluginName]
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
			 timeoutId : 0
			,settings  : {
				 firstClassName : ''
				,delay          : 200
				,onComplete     : false
				,cssProp        : 'height'
				,autoBind       : ''
				,bindObj        : window
			}
			,$elements : null
			,init : function($elements,options){
				var
				 that = this
				;
				this.$elements = $elements;
				this.settings = $.extend({},this.settings,options);
				this.handler = function(){
					clearTimeout(that.timeoutId);
					that.timeoutId = setTimeout(function(){
						that.run($elements);
					},that.settings.delay);
				};
				if(this.settings.autoBind){
					$(this.settings.bindObj)
					 .bind(this.settings.autoBind,that.handler)
					;
				}
				this.handler();
				return this;
			}
			,run : function (elements,options){
				var
				 settings  = $.extend({},this.settings,options)
				,that      = this
				,heights   = []
				,$elements = (elements instanceof jQuery)?elements:$(elements)
				,arry      = this.getRow($elements,settings.firstClassName)
				,$slice    = arry[0]
				,$surplus  = arry[1]
				,len       = $slice.length
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
			,getRow : function($elements,firstClassName){
				var
				 firstOffsetTop = false
				,slicePoint     = 0
				;
				if(firstClassName){
					$elements.removeClass(firstClassName);
				}
				$elements
				 .each(function(i){
					var
					 $this         = $(this)
					,thisOffsetTop = $this.offset().top
					;
					if(firstOffsetTop === false){
						firstOffsetTop = thisOffsetTop;
						if(firstClassName){
							$this.addClass(firstClassName);
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
				if(typeof this.handler === 'function' && this.$elements){
					clearTimeout(this.timeoutId);
					if(this.settings.autoBind){
						$(this.settings.bindObj).unbind(this.settings.autoBind,this.handler);
					}
					this
					 .$elements
					 .data(pluginName,null)
					 .css(this.settings.cssProp,'')
					 .removeClass(this.settings.firstClassName)
					;
				}
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
})(jQuery,window);