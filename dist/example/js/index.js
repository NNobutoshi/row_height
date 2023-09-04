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
    options1 = {
      bindType        : 'elementresize fontresize'
      ,firstClassName : 'js-first-element'
      ,lastClassName  : 'js-last-element'
    }
    ,options2 = {
      firstClassName : 'js-firstelement'
      ,lastClassName : 'js-last-element'
      ,bindType : 'elementresize fontresize'
    }
    ,options3 = {
      bindType : 'elementresize fontresize'
      ,firstClassName : 'js-first-element'
      ,lastClassName : 'js-last-element'
      ,onComplete : function( $base ) {
        $base.addClass( 'js-complete' );
      }
    }
    ,$list1 = $( '#list1>li' )
    ,$list2 = $( '#list2' )
    ,$list3 = $( '#list3' )
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
    className    = 'js-checker'
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
          .prependTo( ( $.isWindow( this ) ) ? 'body' : this )
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
    $base : null
    ,$elemTargets  : null
    ,timeoutId : null
    ,handle    : null
    ,settings  : {
      firstClassName  : ''
      ,lastClassName  : ''
      ,delay          : 200
      ,onBefore       : null
      ,onComplete     : null
      ,cssProp        : 'height'
      ,bindType       : ''
      ,bindObj        : window
      ,forEachRow     : true
    }
    ,init : function( $elemTargets, children, options ) {
      var
        settings = this.settings = $.extend( {}, this.settings, options )
        ,that = this
      ;
      this.$base = $elemTargets;
      if ( children ) {
        $elemTargets = this.$base.find( children );
      }
      this.$elemTargets = $elemTargets;
      this.handle = function() {
        clearTimeout( that.timeoutId );
        that.timeoutId = setTimeout( function() {
          that.run();
        }, that.settings.delay );
      };
      if ( settings.bindType ) {
        $( settings.bindObj )
          .on( settings.bindType, this.handle )
        ;
      }
      this.run();
      return this;
    }
    ,run: function() {
      var
        $initialTargets = this.$elemTargets
        ,that = this
        ,settings = this.settings
      ;
      this.setDataOfDepth();
      ( function _setMaxHeightForEachRow( $elements ) {
        setTimeout( function() {
          $elements = that.get1stTargetRow( $elements );
          that.setMaxHeigthOneRow( $elements );
          if ( $elements.length > 0 ) {
            $initialTargets = $initialTargets.not( $elements );
            _setMaxHeightForEachRow( $initialTargets );
          } else {
            if ( typeof settings.onComplete === 'function' ) {
              settings.onComplete( that.$base );
            }
          }
        }, 16 );
      } )( $initialTargets );
    }
    ,setMaxHeigthOneRow: function( $elements ) {
      var
        heightData = []
        ,settings = this.settings
      ;
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
          if ( settings.firstClassName ) {
            if ( index === 0 ) {
              $elem.addClass( settings.firstClassName );
            } else {
              $elem.removeClass( settings.firstClassName );
            }
          }
          if ( settings.lastClassName ) {
            if ( index === $elements.length - 1 ) {
              $elem.addClass( settings.lastClassName );
            } else {
              $elem.removeClass( settings.lastClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
      ;
    }
    ,get1stTargetRow: function( $elements ) {
      var $rowGroup = $();
      _getRowGroup( $elements );
      return $rowGroup;
      function _getRowGroup( $elements ) {
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
              $rowGroup = $();
            }
            if ( posY === minPosY && depth === maxDepth ) {
              $rowGroup = $.merge( $rowGroup, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } );
        if ( hasChildInLine === true ) {
          _getRowGroup( $elements.not( $rowGroup ) );
        }
      }
    }
    ,setDataOfDepth : function() {
      var that = this;
      this.$elemTargets
        .each( function( index , elem ) {
          $( elem ).attr( 'data-rowheight-depth', 'null' );
        } )
        .each( function( index, elem ) {
          var len = $( elem ).parents( '[data-rowheight-depth]' ).length;
          $( elem ).attr( 'data-rowheight-depth', len );
          if ( len > that.maxDepth ) {
            that.maxDepth = len;
          }
        } );
    }
    ,destroy : function() {
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if ( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handle );
      }
      this.$elemTargets
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
      ;
      return this
        .$base
        .removeData( pluginName )
      ;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      plugin
      ,$elemTargets = this
      ,options
      ,children
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
      this.data(
        pluginName, Object.create( $[ pluginName ] ).init( $elemTargets, children, options )
      );
    }
    plugin = this.data( pluginName );
    if ( plugin[ arg1 ] ) {
      return plugin[ arg1 ].apply( plugin, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
        obj instanceof jquery__WEBPACK_IMPORTED_MODULE_0__ === false;
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