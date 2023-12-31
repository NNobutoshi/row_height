/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/example/js/index.entry.js":
/*!***************************************!*\
  !*** ./src/example/js/index.entry.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var _js_jquery_row_height_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../js/jquery.row_height.js */ "./src/js/jquery.row_height.js");
/* harmony import */ var _js_jquery_resize_events_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../js/jquery.resize_events.js */ "./src/js/jquery.resize_events.js");





( function( $ ) {
  var
    $list1 = $( '#list1>li' )
    ,$list2 = $( '#list2' )
    ,$list3 = $( '#list3' )
    ,options1 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
    }
    ,options2 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
    }
    ,options3 = {
      eventType           : 'elementresize fontresize',
      firstOfRowClassName : 'js-firstOfRow',
      lastOfRowClassName  : 'js-lastOfRow',
      onComplete          : function( instantiated ) {
        instantiated.$elemBase.addClass( 'js-complete' );
      },
    }
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

} )( jquery__WEBPACK_IMPORTED_MODULE_0__ );


/***/ }),

/***/ "./src/js/jquery.resize_events.js":
/*!****************************************!*\
  !*** ./src/js/jquery.resize_events.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/*!
* jQuery.resize_events
* version : 1.0.2
* link    : https://github.com/NNobutoshi/resize_events/
* License : MIT
*/



/*! elementresize  */
( function( $, window ) {
  var
    eventName  = 'elementresize'
    ,interval  = 200
  ;
  $.event.special[ eventName ] = {
    setup : function() {
      var
        $this = $( this )
      ;
      $this.data( eventName, {
        width   : $this.width()
        ,height : $this.height()
        ,timer  : window.setInterval( function() {
          var
            data    = $this.data( eventName )
            ,width  = $this.width()
            ,height = $this.height()
          ;
          if (
            data.width  !== width || data.height !== height
          ) {
            data.width  = width;
            data.height = height;
            $this.triggerHandler( eventName );
          }
        }, interval )
      } );
    }
    ,teardown : function() {
      var
        $this = $( this )
      ;
      window.clearInterval( $this.data( eventName ).timer );
      $this.removeData( eventName );
    }
  };

  $.fn[ eventName ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( eventName, data, fn ) :
      this.trigger( eventName )
    ;
  };

} )( jquery__WEBPACK_IMPORTED_MODULE_0__, window );

/*! fontresize  */
( function( $ ) {
  var
    className    = 'js-resizechecker'
    ,eventName   = 'fontresize'
    ,triggerName = 'elementresize'
  ;

  $.event.special[ eventName ] = {

    setup: function() {
      var
        $this    = $( this )
        ,$checker = $( '<ins class="' + className + '">&nbsp;</ins>' )
          .css( {
            display   : 'block'
            ,left     : '-9999px'
            ,position : 'absolute'
          } )
          .prependTo( ( this != null && this === this.window ) ? 'body' : this )
          .on( triggerName, function() {
            $this.trigger( eventName );
          } )
      ;

      $this.data( eventName, $checker );
    }
    ,teardown : function() {
      var
        $this = $( this )
      ;

      $this
        .data( eventName )
        .off( triggerName, function() {
          $this.trigger( eventName );
        } )
        .remove()
      ;
    }
  };
  $.fn[ eventName ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( eventName, data, fn ) :
      this.trigger( eventName )
    ;
  };

} )( jquery__WEBPACK_IMPORTED_MODULE_0__ );


/***/ }),

/***/ "./src/js/jquery.row_height.js":
/*!*************************************!*\
  !*** ./src/js/jquery.row_height.js ***!
  \*************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/*!
* jQuery.row_height
* version : 3.1.0
* link    : https://github.com/NNobutoshi/row_height/
* License : MIT
*/


( function( $, window, undefined ) {
  'use strict';
  var
    pluginName = 'rowHeight'
  ;
  $[ pluginName ] = {
    $elemBase : null
    ,$elemTargets  : null
    ,rafId : null
    ,handle    : null
    ,settings  : {
      firstOfRowClassName  : ''
      ,lastOfRowClassName  : ''
      ,eventDelay          : 160
      ,settingHeightDelay  : 16
      ,onBefore            : null
      ,onComplete          : null
      ,cssProp             : 'height'
      ,eventType           : ''
      ,eventObj            : window
      ,isTargetAll         : false
    }
    ,init : function( elements, children, options ) {
      var
        that = this
        ,settings = this.settings = $.extend( {}, this.settings, options )
      ;
      this.$elemBase = ( elements instanceof $ ) ? elements : $( elements );
      if (
        children instanceof $ === true ||
        children instanceof HTMLElement === true ||
        typeof children === 'string'
      ) {
        this.$elemTargets = this.$elemBase.find( children );
      } else {
        this.$elemTargets = this.$elemBase;
      }
      this.handle = function( e ) {
        var startTime = undefined;
        cancelAnimationFrame( that.rafId );
        ( function _handle() {
          that.rafId = requestAnimationFrame( function( time ) {
            if ( startTime === undefined ) {
              startTime = time;
            }
            if ( time - startTime > that.settings.eventDelay ) {
              that.run( that.$elemTargets );
            } else {
              _handle();
            }
          } );
        } )();
      };
      if ( settings.eventType ) {
        $( settings.eventObj )
          .on( settings.eventType, that.handle )
        ;
      }
      this.run( this.$elemTargets );
      return this;
    }
    ,run: function( elements, options ) {
      var
        that = this
        ,settings = $.extend( {}, this.settings, options )
        ,$initialTargets = ( elements instanceof $ === true ) ? elements : $( elements )
        ,startTime = undefined
      ;
      if ( typeof settings.onBefore === 'function' ) {
        settings.onBefore( this );
      }
      this.setDataOfDepth( $initialTargets );
      if ( settings.isTargetAll === true ) {
        this.setMaxHeight( $initialTargets, settings );
        return this;
      }
      ( function _setMaxHeightForEachRow( $elements ) {
        requestAnimationFrame( function( time ) {
          if ( startTime === undefined ) {
            startTime = time;
          }
          if ( time - startTime > settings.settingHeightDelay ) {
            $elements = that.getElementsOnFirstRow( $elements );
            that.setMaxHeight( $elements );
            if ( $elements.length > 0 ) {
              $initialTargets = $initialTargets.not( $elements );
              _setMaxHeightForEachRow( $initialTargets );
            } else {
              if ( typeof settings.onComplete === 'function' ) {
                settings.onComplete( that );
              }
            }
          } else {
            _setMaxHeightForEachRow( $elements );
          }
        } );
      } )( $initialTargets );
      return this;
    }
    ,setMaxHeight: function( elements, options ) {
      var
        heightData = []
        ,$elements = ( elements instanceof $ === true ) ? elements : $( elements )
        ,settings = $.extend( {}, this.settings, options )
      ;
      if ( $elements && $elements.length === 0 ) {
        return this;
      }
      $elements
        .css( settings.cssProp, '' )
        .each( function( index, elem ) {
          var
            $elem    = $( elem )
            ,boxType = $elem.css( 'boxSizing' )
          ;
          $elem.removeAttr( 'data-rowheight-depth' );
          if ( boxType === 'border-box' ) {
            heightData[ heightData.length ] = $elem.outerHeight();
          } else {
            heightData[ heightData.length ] = $elem.height();
          }
          if ( settings.firstOfRowClassName ) {
            if ( index === 0 ) {
              $elem.addClass( settings.firstOfRowClassName );
            } else {
              $elem.removeClass( settings.firstOfRowClassName );
            }
          }
          if ( settings.lastOfRowClassName ) {
            if ( index === $elements.length - 1 ) {
              $elem.addClass( settings.lastOfRowClassName );
            } else {
              $elem.removeClass( settings.lastOfRowClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
      ;
      return this;
    }
    ,getElementsOnFirstRow: function( elements ) {
      var
        $elemSelected = $()
        ,$elements = ( elements instanceof $ === true ) ? elements : $( elements )
      ;
      _selectElementsOnFirstRow( $elements );
      return $elemSelected;
      function _selectElementsOnFirstRow( $elements ) {
        var
          minPosY = Infinity
          ,hasChildInLine = false
          ,maxDepth = -1
        ;
        $elements
          .each( function( index ,elem ) {
            var
              $elem = $( elem )
              ,posY = $elem.offset().top
              ,depth = parseInt( $elem.attr( 'data-rowheight-depth' ) )
            ;
            if ( posY < minPosY && depth > maxDepth ) {
              hasChildInLine = false;
              minPosY = posY;
              maxDepth = depth;
              $elemSelected = $();
            }
            if ( posY === minPosY && depth === maxDepth ) {
              $elemSelected = $.merge( $elemSelected, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } )
        ;
        if ( hasChildInLine === true ) {
          _selectElementsOnFirstRow( $elements.not( $elemSelected ) );
        }
      }
    }
    ,setDataOfDepth : function( elements ) {
      var
        maxDepth = -1
        ,$elements = ( elements instanceof $ === true ) ? elements : $( elements )
      ;
      $elements
        .each( function( index , elem ) {
          $( elem ).attr( 'data-rowheight-depth', 'null' );
        } )
        .each( function( index, elem ) {
          var len = $( elem ).parents( '[data-rowheight-depth]' ).length;
          $( elem ).attr( 'data-rowheight-depth', len );
          if ( len > maxDepth ) {
            maxDepth = len;
          }
        } )
      ;
    }
    ,destroy : function( elements ) {
      var $elements = ( elements && elements instanceof $ === true ) ? elements : $( elements );
      if ( !elements ) {
        $elements = this.$elemTargets;
      }
      cancelAnimationFrame( this.rafId );
      this.rafId = null;
      if ( this.settings.eventType ) {
        $( this.settings.eventObj ).off( this.settings.eventType, this.handle );
      }
      $elements
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstOfRowClassName )
        .removeClass( this.settings.lastOfRowClassName )
      ;
      if ( this.$elemBase && this.$elemBase.length > 0 ) {
        return this
          .$elemBase
          .removeData( pluginName )
        ;
      }
      return $elements;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      plugin
      ,$elemTargets = this
      ,children
      ,options
    ;
    if ( !this.data( pluginName ) ) {
      if ( $[ pluginName ][ arg1 ] ) {
        if ( arg2 && arg3 ) {
          children = arg2;
          options = arg3;
        } else if ( arg2 ) {
          if ( _isOptions( arg2 ) ) {
            options = arg2;
          } else {
            children = arg2;
          }
        }
      } else {
        if ( arg1 && arg2 ) {
          children = arg1;
          options = arg2;
        } else if ( arg1 ) {
          if ( _isOptions( arg1 ) ) {
            options = arg1;
          } else {
            children = arg1;
          }
        }
      }
      if ( !$[ pluginName ][ arg1 ] ) {
        this.data(
          pluginName, Object.create( $[ pluginName ] ).init( $elemTargets, children, options )
        );
      }
    }
    plugin = this.data( pluginName );
    if ( plugin && plugin[ arg1 ] ) {
      return plugin[ arg1 ].apply( plugin, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== Node.ELEMENT_NODE ) &&
        obj instanceof $ === false;
    }
  };
} )( jquery__WEBPACK_IMPORTED_MODULE_0__, window );


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"example/js/index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkjquery_row_height"] = self["webpackChunkjquery_row_height"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./js/vendor"], function() { return __webpack_require__("./src/example/js/index.entry.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=../../sourcemaps/example/js/index.js.map