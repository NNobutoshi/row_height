(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

require('../modules/jquery.resize_events.js');

require('../modules/jquery.row_height.js');

(function ($) {
  var options1 = {
    bindType: 'elementresize fontresize',
    firstClassName: 'js-first',
    lastClassName: 'js-last'
  },
      options2 = {
    firstClassName: 'js-first',
    lastClassName: 'js-last',
    bindType: 'elementresize fontresize',
    onComplete: function onComplete($self) {
      $self.then('#list2>li>div').then('#list2>li>div>div').then('#list2>li>div').then('#list2>li');
    }
  },
      options3 = {
    bindType: 'elementresize fontresize',
    onComplete: function onComplete($self) {
      $self.then('#list3>li>div').then('#list3>li');
    }
  },
      $list1 = $('#list1>li').rowHeight(options1),
      $list2 = $('#list2').rowHeight('>li', options2),
      $list3 = $('#list3').rowHeight('>li', options3);
  $('#list1_i').on('click', function () {
    $list1.rowHeight(options1);
    return false;
  });
  $('#list1_d').on('click', function () {
    $list1.rowHeight('destroy');
    return false;
  });
  $('#list2_i').on('click', function () {
    $list2.rowHeight('>li', options2);
    return false;
  });
  $('#list2_d').on('click', function () {
    $list2.rowHeight('destroy').find('div').css('height', '');
    return false;
  });
  $('#list3_i').on('click', function () {
    $list3.rowHeight('>li>div', options3);
    return false;
  });
  $('#list3_d').on('click', function () {
    $list3.rowHeight('destroy');
    return false;
  });
})((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../modules/jquery.resize_events.js":2,"../modules/jquery.row_height.js":3}],2:[function(require,module,exports){
(function (global){
"use strict";

/*!
* jQuery.resize_events
* version : 1.0.2
* link    : https://github.com/NNobutoshi/resize_events/
* License : MIT
*/

/*! elementresize  */
(function ($, window) {
  var eventName = 'elementresize',
      interval = 200;
  $.event.special[eventName] = {
    setup: function setup() {
      var $this = $(this);
      $this.data(eventName, {
        width: $this.width(),
        height: $this.height(),
        timer: window.setInterval(function () {
          var data = $this.data(eventName),
              width = $this.width(),
              height = $this.height();

          if (data.width !== width || data.height !== height) {
            data.width = width;
            data.height = height;
            $this.triggerHandler(eventName);
          }
        }, interval)
      });
    },
    teardown: function teardown() {
      var $this = $(this);
      window.clearInterval($this.data(eventName).timer);
      $this.removeData(eventName);
    }
  };

  $.fn[eventName] = function (data, fn) {
    return arguments.length > 0 ? this.bind(eventName, data, fn) : this.trigger(eventName);
  };
})((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null), window);
/*! fontresize  */


(function ($) {
  var className = 'js-checker',
      eventName = 'fontresize',
      triggerName = 'elementresize';
  $.event.special[eventName] = {
    setup: function setup() {
      var $this = $(this),
          $checker = $('<ins class="' + className + '">&nbsp;</ins>').css({
        display: 'block',
        left: '-9999px',
        position: 'absolute'
      }).prependTo($.isWindow(this) ? 'body' : this).bind(triggerName, function () {
        $this.trigger(eventName);
      });
      $this.data(eventName, $checker);
    },
    teardown: function teardown() {
      var $this = $(this);
      $this.data(eventName).unbind(triggerName, function () {
        $this.trigger(eventName);
      }).remove();
    }
  };

  $.fn[eventName] = function (data, fn) {
    return arguments.length > 0 ? this.bind(eventName, data, fn) : this.trigger(eventName);
  };
})((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';
/*!
* jQuery.row_height
* version : 4.0.0
* link    : https://github.com/NNobutoshi/row_height/
* License : MIT
*/

var _jquery = _interopRequireDefault((typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pluginName = 'rowHeight',
    $ = _jquery["default"];

$[pluginName] =
/*#__PURE__*/
function () {
  function RowHeight() {
    _classCallCheck(this, RowHeight);

    this.$elements = null;
    this.timeoutId = null;
    this.handler = null;
    this.settings = {
      firstClassName: '',
      lastClassName: '',
      delay: 200,
      onBefore: null,
      onComplete: null,
      cssProp: 'height',
      bindType: '',
      bindObj: window,
      forEachRow: true
    };
  }

  _createClass(RowHeight, [{
    key: "init",
    value: function init($elements, children, options) {
      var _this = this;

      var settings = this.settings = $.extend({}, this.settings, options);
      this.$elements = $elements;

      if (children) {
        $elements = this.$children = $elements.find(children);
      }

      if (settings.bindType) {
        this.handler = function () {
          clearTimeout(_this.timeoutId);
          _this.timeoutId = setTimeout(function () {
            _this.run($elements, settings);
          }, settings.delay);
        };

        $(settings.bindObj).on(settings.bindType, this.handler);
      }

      this.run($elements, settings);
      return this;
    }
  }, {
    key: "run",
    value: function run(elements, options, deferred) {
      var settings = $.extend({}, this.settings, options);
      var $elements;

      if (elements instanceof _jquery["default"]) {
        $elements = elements;
      } else if (elements) {
        $elements = $(elements);
      }

      if (typeof settings.onBefore === 'function') {
        settings.onBefore();
      }

      if ($elements) {
        this.align($elements, settings, deferred);
      }

      return this;
    }
  }, {
    key: "align",
    value: function align($elements, settings, deferred) {
      var _this2 = this;

      var heights = [];
      var paired$, $ends;

      if (settings.forEachRow === true) {
        paired$ = this.getRow($elements);
        $elements = paired$[0];
        $ends = paired$[1];
      }

      $elements.css(settings.cssProp, '').each(function (index, item) {
        var $this = $(item),
            boxType = $this.css('boxSizing');

        if (boxType === 'border-box') {
          heights[heights.length] = $this.outerHeight();
        } else {
          heights[heights.length] = $this.height();
        }

        if (settings.firstClassName) {
          if (index === 0) {
            $this.addClass(settings.firstClassName);
          } else {
            $this.removeClass(settings.firstClassName);
          }
        }

        if (settings.lastClassName) {
          if (index === $elements.length - 1) {
            $this.addClass(settings.lastClassName);
          } else {
            $this.removeClass(settings.lastClassName);
          }
        }
      }).css(settings.cssProp, Math.max.apply(null, heights) + 'px');
      setTimeout(function () {
        if ($ends && $ends.length) {
          settings.children = null;

          _this2.align($ends, settings, deferred);
        } else {
          if (deferred) {
            deferred.resolve();
            delete _this2.deferred;
          } else {
            if (typeof settings.onComplete === 'function') {
              settings.onComplete.call(_this2, _this2);
            }
          }
        }
      }, 1);
    }
  }, {
    key: "getRow",
    value: function getRow($elements) {
      var firstOffsetTop, $firstRowGroup, $ends;
      $elements.each(function (index, item) {
        var $this = $(item),
            thisOffsetTop = $this.offset().top;

        if (index === 0) {
          firstOffsetTop = thisOffsetTop;
        }

        if (firstOffsetTop === thisOffsetTop) {
          if (!$firstRowGroup) {
            $firstRowGroup = $this;
          } else {
            $.merge($firstRowGroup, $this);
          }
        } else {
          if (!$ends) {
            $ends = $this;
          } else {
            $.merge($ends, $this);
          }
        }
      });
      return [$firstRowGroup, $ends];
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var $elements;
      clearTimeout(this.timeoutId);
      this.timeoutId = null;

      if (this.settings.bindType) {
        $(this.settings.bindObj).off(this.settings.bindType, this.handler);
      }

      delete this.deferred;

      if (this.$children) {
        $elements = this.$children;
      } else {
        $elements = this.$elements;
      }

      $elements.css(this.settings.cssProp, '').removeClass(this.settings.firstClassName).removeClass(this.settings.lastClassName);
      return this.$elements.removeData(pluginName);
    }
  }, {
    key: "then",
    value: function then(elements, options) {
      var _this3 = this;

      var deferred = $.Deferred();
      options = options || {};

      if (this.deferred) {
        this.deferred.promise().then(function () {
          _this3.run(elements, options, deferred);
        });
      } else {
        this.run(elements, options, deferred);
      }

      this.deferred = deferred;
      return this;
    }
  }]);

  return RowHeight;
}();

$.fn[pluginName] = function (arg1, arg2, arg3) {
  var $elements = this;
  var thisPlugin, options, children;

  if (!this.data(pluginName)) {
    if ($[pluginName][arg1]) {
      // $('elements').thisPlugin( 'align', '>li', {'firstClassName': 'foo'} );
      if (arg2 && arg3) {
        children = arg2;
        options = arg3;
      } else if (arg2) {
        // $('elements').thisPlugin( 'align', { 'firstClassName': 'foo'} );
        if (_isOptions(arg2)) {
          options = arg2; // $('elements').thisPlugin( 'align', '>li' );
        } else {
          children = arg2;
        }
      }
    } else {
      // $('elements').thisPlugin( '>li', {'firstClassName': 'foo'} );
      if (arg1 && arg2) {
        children = arg1;
        options = arg2;
      } else if (arg1) {
        // $('elements').thisPlugin( {'firstClassName': 'foo'} );
        if (_isOptions(arg1)) {
          options = arg1; // $('elements').thisPlugin( '>li' );
        } else {
          children = arg1;
        }
      }
    }

    this.data(pluginName, new $[pluginName]().init($elements, children, options));
  }

  thisPlugin = this.data(pluginName);

  if (typeof arg1 === 'string' && thisPlugin[arg1]) {
    return thisPlugin[arg1].apply(thisPlugin, Array.prototype.slice.call(arguments, 1));
  }

  return this;

  function _isOptions(obj) {
    return _typeof(obj) === 'object' && (obj.nodeType === undefined || obj.nodeType !== 1) && obj instanceof _jquery["default"] === false;
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])

//# sourceMappingURL=index.js.map
