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
      ,firstClassName : 'js-first'
      ,lastClassName  : 'js-last'
    }
    ,options2 = {
      firstClassName : 'js-first'
      ,lastClassName : 'js-last'
      // ,bindType : 'elementresize fontresize'
      ,bindType : 'elementresize'
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
    ,$list1 = $( '#list1>li' )
    ,$list2 = $( '#list2>li,#list2>li>div,#list2>li>div>div' )
    // ,$list2 = $( '#list2>li' )
    ,$list3 = $( '#list3>li, #list3>li>div' )
  ;
  $( '#list1_i' )
    .on( 'click', function() {
      $list1.rowHeight( options1 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list1_d' )
    .on( 'click', function() {
      $list1.rowHeight( 'destroy' );
      return false;
    } )
  ;
  $( '#list2_i' )
    .on( 'click', function() {
      $list2.rowHeight( options2 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list2_d' )
    .on( 'click', function() {
      $list2.rowHeight( 'destroy' ).find( 'div' ).css( 'height', '' );
      return false;
    } )
  ;
  $( '#list3_i' )
    .on( 'click', function() {
      $list3.rowHeight( options3 );
      return false;
    } )
    .trigger( 'click' )
  ;
  $( '#list3_d' )
    .on( 'click', function() {
      $list3.rowHeight( 'destroy' ).find( 'div' ).css( 'height', '' );
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
      this.bind( eventName, data, fn ) :
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
          .bind( triggerName, function() {
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
        .unbind( triggerName, function() {
          $this.trigger( eventName );
        } )
        .remove()
      ;
    }
  };
  $.fn[ eventName ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.bind( eventName, data, fn ) :
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
    $elemTargets  : null
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
      var settings = this.settings = $.extend( {}, this.settings, options );
      var that = this;
      if ( children ) {
        $elemTargets = $elemTargets.find( children );
      }
      this.$elemTargets = $elemTargets;
      this.handle = function() {
        clearTimeout( that.timeoutId );
        that.timeoutId = setTimeout( function() {
          that.run( that.$elemTargets, that.settings );
        }, that.settings.delay );
      };
      if ( settings.bindType ) {
        $( settings.bindObj )
          .on( settings.bindType, this.handle )
        ;
      }
      // this.run( $elemTargets, options );
      this.setDataOfDepth();
      this.setMaxHeigthOnRow( this.$elemTargets );
      return this;
    }
    ,setMaxHeigthOnRow: function( $elements ) {
      var
        heightData = []
        ,settings = this.settings
      ;
      $elements = this.get1stTargetRow( $elements );
      $elements
        .css( settings.cssProp, '' )
        .each( function( index ) {
          var
            $this    = $( this )
            ,boxType = $this.css( 'boxSizing' )
          ;
          if ( boxType === 'border-box' ) {
            heightData[ heightData.length ] = $this.outerHeight();
          } else {
            heightData[ heightData.length ] = $this.height();
          }
          if ( settings.firstClassName ) {
            if ( index === 0 ) {
              $this.addClass( settings.firstClassName );
            } else {
              $this.removeClass( settings.firstClassName );
            }
          }
          if ( settings.lastClassName ) {
            if ( index === $elements.length - 1 ) {
              $this.addClass( settings.lastClassName );
            } else {
              $this.removeClass( settings.lastClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heightData ) + 'px' )
        .css( 'border','solid 3px #f0f' )
      ;
    }
    ,get1stTargetRow: function() {
      var $rowGroup = $();
      _getRowGroup( this.$elemTargets );
      return $rowGroup;
      function _getRowGroup( $elemTargets ) {
        var
          minPosY = Infinity
          ,hasChildInLine = false
          ,maxDepth = -1
        ;
        $elemTargets
          .each( function( index ,elem ) {
            var
              $elem = $( elem )
              ,posY = $elem.position().top
              ,depth = parseInt( $elem.attr( 'data-rowheight-depth' ) )
            ;
            if ( posY < minPosY || ( posY === minPosY && depth > maxDepth ) ) {
              hasChildInLine = false;
              maxDepth = depth;
              minPosY = posY;
              $rowGroup = $();
            }
            if ( posY === minPosY && maxDepth === depth ) {
              $rowGroup = $.merge( $rowGroup, $elem );
              if ( $elem.children( '[data-rowheight-depth]' ).length > 0 ) {
                hasChildInLine = true;
              }
            }
          } );
        if ( hasChildInLine === true ) {
          _getRowGroup( $elemTargets.not( $rowGroup ) );
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
    ,run : function( elements, options, deferred ) {
      var
        settings
        ,$elemTargets
      ;
      if ( elements instanceof jquery__WEBPACK_IMPORTED_MODULE_0__ ) {
        $elemTargets = elements;
      } else if ( elements ) {
        $elemTargets = $( elements );
      }
      settings = $.extend( {}, this.settings, options );
      if ( typeof settings.onBefore === 'function' ) {
        settings.onBefore();
      }
      if ( $elemTargets ) {
        this.align( $elemTargets, settings, deferred );
      }
      return this;
    }
    ,align : function( $elemTargets , settings, deferred ) {
      var
        that     = this
        ,heights = []
        ,paired$
        ,$ends
      ;
      if ( settings.forEachRow === true ) {
        paired$ = this.getRow( $elemTargets );
        $elemTargets = paired$[ 0 ];
        $ends  = paired$[ 1 ];
      }
      $elemTargets
        .css( settings.cssProp, '' )
        .each( function( index ) {
          var
            $this    = $( this )
            ,boxType = $this.css( 'boxSizing' )
          ;
          if ( boxType === 'border-box' ) {
            heights[ heights.length ] = $this.outerHeight();
          } else {
            heights[ heights.length ] = $this.height();
          }
          if ( settings.firstClassName ) {
            if ( index === 0 ) {
              $this.addClass( settings.firstClassName );
            } else {
              $this.removeClass( settings.firstClassName );
            }
          }
          if ( settings.lastClassName ) {
            if ( index === $elemTargets.length - 1 ) {
              $this.addClass( settings.lastClassName );
            } else {
              $this.removeClass( settings.lastClassName );
            }
          }
        } )
        .css( settings.cssProp, Math.max.apply( null, heights ) + 'px' )
      ;
      setTimeout( function() {
        if ( $ends && $ends.length ) {
          settings.children = null;
          that.align( $ends, settings, deferred );
        } else {
          if ( deferred ) {
            deferred.resolve();
            delete that.deferred;
          }
          if ( typeof settings.onComplete === 'function' ) {
            settings.onComplete();
          }
        }
      }, 1 );
    }
    ,getRow : function( $elemTargets ) {
      var
        firstOffsetTop
        ,$firstRowGroup
        ,$ends
      ;
      $elemTargets
        .each( function( index ) {
          var
            $this         = $( this )
            ,thisOffsetTop = $this.offset().top
          ;
          if ( index === 0 ) {
            firstOffsetTop = thisOffsetTop;
          }
          if ( firstOffsetTop === thisOffsetTop ) {
            if ( !$firstRowGroup ) {
              $firstRowGroup = $this;
            } else {
              $.merge( $firstRowGroup, $this );
            }
          } else {
            if ( !$ends ) {
              $ends = $this;
            } else {
              $.merge( $ends, $this );
            }
          }
        } )
      ;
      return [ $firstRowGroup, $ends ];
    }
    ,destroy : function() {
      console.info( 'click destrory' );
      var $elemTargets;
      clearTimeout( this.timeoutId );
      this.timeoutId = null;
      if ( this.settings.bindType ) {
        $( this.settings.bindObj ).off( this.settings.bindType, this.handle );
      }
      delete this.deferred;
      if ( this.$children ) {
        $elemTargets = this.$children;
      } else {
        $elemTargets = this.$elemTargets;
      }
      $elemTargets
        .css( this.settings.cssProp, '' )
        .removeClass( this.settings.firstClassName )
        .removeClass( this.settings.lastClassName )
      ;
      return this
        .$elemTargets
        .removeData( pluginName )
      ;
    }
    ,then: function( elements, options ) {
      var
        deferred = $.Deferred()
        ,that    = this
      ;
      options = options || {};
      if ( this.deferred ) {
        this.deferred.promise().then( function() {
          that.run( elements, options, deferred );
        } );
      } else {
        this.run( elements, options, deferred );
      }
      this.deferred = deferred;
      return this;
    }
  };
  $.fn[ pluginName ] = function( arg1, arg2, arg3 ) {
    var
      rowHeight
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
      this.data( pluginName, _inherit( $[ pluginName ] ).init( $elemTargets, children, options ) );
    }
    rowHeight = this.data( pluginName );
    if ( rowHeight[ arg1 ] ) {
      return rowHeight[ arg1 ].apply( rowHeight, Array.prototype.slice.call( arguments, 1 ) );
    }
    return this;
    function _isOptions( obj ) {
      return typeof obj === 'object' &&
        ( obj.nodeType === undefined || obj.nodeType !== 1 ) &&
        obj instanceof jquery__WEBPACK_IMPORTED_MODULE_0__ === false;
    }
  };
  function _inherit( o ) {
    if ( Object.create ) {
      return Object.create( o );
    }
    var F = function() {};
    F.prototype = o;
    return new F();
  }
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