require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],2:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":5}],3:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))

},{"./emptyFunction":1,"_process":5}],4:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,require('_process'))

},{"./lib/ReactPropTypesSecret":10,"_process":5,"fbjs/lib/invariant":2,"fbjs/lib/warning":3}],7:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":10,"fbjs/lib/emptyFunction":1,"fbjs/lib/invariant":2}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');
var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require('_process'))

},{"./checkPropTypes":6,"./lib/ReactPropTypesSecret":10,"_process":5,"fbjs/lib/emptyFunction":1,"fbjs/lib/invariant":2,"fbjs/lib/warning":3,"object-assign":4}],9:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require('_process'))

},{"./factoryWithThrowingShims":7,"./factoryWithTypeCheckers":8,"_process":5}],10:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],11:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function:
        while (_again) {
            var object = _x, property = _x2, receiver = _x3;
            _again = false;
            if (object === null)
                object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === undefined) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                    return undefined;
                } else {
                    _x = parent;
                    _x2 = property;
                    _x3 = receiver;
                    _again = true;
                    desc = parent = undefined;
                    continue _function;
                }
            } else if ('value' in desc) {
                return desc.value;
            } else {
                var getter = desc.get;
                if (getter === undefined) {
                    return undefined;
                }
                return getter.call(receiver);
            }
        }
};
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var BurgerIcon = function (_Component) {
        _inherits(BurgerIcon, _Component);
        function BurgerIcon(props) {
            _classCallCheck(this, BurgerIcon);
            _get(Object.getPrototypeOf(BurgerIcon.prototype), 'constructor', this).call(this, props);
            this.state = { hover: false };
        }
        _createClass(BurgerIcon, [
            {
                key: 'getLineStyle',
                value: function getLineStyle(index) {
                    return {
                        position: 'absolute',
                        height: '20%',
                        left: 0,
                        right: 0,
                        top: 20 * (index * 2) + '%',
                        opacity: this.state.hover ? 0.6 : 1
                    };
                }
            },
            {
                key: 'render',
                value: function render() {
                    var _this = this;
                    var icon = undefined;
                    var buttonStyle = {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            border: 'none',
                            opacity: 0,
                            fontSize: 8,
                            cursor: 'pointer'
                        };
                    if (this.props.customIcon) {
                        var extraProps = {
                                className: 'bm-icon',
                                style: _extends({
                                    width: '100%',
                                    height: '100%'
                                }, this.props.styles.bmIcon)
                            };
                        icon = _react2['default'].cloneElement(this.props.customIcon, extraProps);
                    } else {
                        icon = _react2['default'].createElement('span', null, [
                            0,
                            1,
                            2
                        ].map(function (bar) {
                            return _react2['default'].createElement('span', {
                                key: bar,
                                className: 'bm-burger-bars ' + _this.props.barClassName,
                                style: _extends({}, _this.getLineStyle(bar), _this.props.styles.bmBurgerBars)
                            });
                        }));
                    }
                    return _react2['default'].createElement('div', {
                        className: 'bm-burger-button ' + this.props.className,
                        style: _extends({ zIndex: 1 }, this.props.styles.bmBurgerButton)
                    }, icon, _react2['default'].createElement('button', {
                        onClick: this.props.onClick,
                        onMouseOver: function () {
                            return _this.setState({ hover: true });
                        },
                        onMouseOut: function () {
                            return _this.setState({ hover: false });
                        },
                        style: buttonStyle
                    }, 'Open Menu'));
                }
            }
        ]);
        return BurgerIcon;
    }(_react.Component);
exports['default'] = BurgerIcon;
BurgerIcon.propTypes = {
    barClassName: _propTypes2['default'].string,
    customIcon: _propTypes2['default'].element,
    styles: _propTypes2['default'].object
};
BurgerIcon.defaultProps = {
    barClassName: '',
    className: '',
    styles: {}
};
module.exports = exports['default'];
},{"prop-types":9,"react":undefined}],12:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function:
        while (_again) {
            var object = _x, property = _x2, receiver = _x3;
            _again = false;
            if (object === null)
                object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === undefined) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                    return undefined;
                } else {
                    _x = parent;
                    _x2 = property;
                    _x3 = receiver;
                    _again = true;
                    desc = parent = undefined;
                    continue _function;
                }
            } else if ('value' in desc) {
                return desc.value;
            } else {
                var getter = desc.get;
                if (getter === undefined) {
                    return undefined;
                }
                return getter.call(receiver);
            }
        }
};
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var CrossIcon = function (_Component) {
        _inherits(CrossIcon, _Component);
        function CrossIcon() {
            _classCallCheck(this, CrossIcon);
            _get(Object.getPrototypeOf(CrossIcon.prototype), 'constructor', this).apply(this, arguments);
        }
        _createClass(CrossIcon, [
            {
                key: 'getCrossStyle',
                value: function getCrossStyle(type) {
                    return {
                        position: 'absolute',
                        width: 3,
                        height: 14,
                        transform: type === 'before' ? 'rotate(45deg)' : 'rotate(-45deg)'
                    };
                }
            },
            {
                key: 'render',
                value: function render() {
                    var _this = this;
                    var icon;
                    var buttonWrapperStyle = {
                            position: 'absolute',
                            width: 24,
                            height: 24,
                            right: 8,
                            top: 8
                        };
                    var buttonStyle = {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            border: 'none',
                            textIndent: -9999,
                            background: 'transparent',
                            outline: 'none',
                            cursor: 'pointer'
                        };
                    if (this.props.customIcon) {
                        var extraProps = {
                                className: 'bm-cross',
                                style: _extends({
                                    width: '100%',
                                    height: '100%'
                                }, this.props.styles.bmCross)
                            };
                        icon = _react2['default'].cloneElement(this.props.customIcon, extraProps);
                    } else {
                        icon = _react2['default'].createElement('span', {
                            style: {
                                position: 'absolute',
                                top: '6px',
                                right: '14px'
                            }
                        }, [
                            'before',
                            'after'
                        ].map(function (type, i) {
                            return _react2['default'].createElement('span', {
                                key: i,
                                className: 'bm-cross ' + _this.props.crossClassName,
                                style: _extends({}, _this.getCrossStyle(type), _this.props.styles.bmCross)
                            });
                        }));
                    }
                    return _react2['default'].createElement('div', {
                        className: 'bm-cross-button ' + this.props.className,
                        style: _extends({}, buttonWrapperStyle, this.props.styles.bmCrossButton)
                    }, icon, _react2['default'].createElement('button', {
                        onClick: this.props.onClick,
                        style: buttonStyle
                    }, 'Close Menu'));
                }
            }
        ]);
        return CrossIcon;
    }(_react.Component);
exports['default'] = CrossIcon;
CrossIcon.propTypes = {
    crossClassName: _propTypes2['default'].string,
    customIcon: _propTypes2['default'].element,
    styles: _propTypes2['default'].object
};
CrossIcon.defaultProps = {
    crossClassName: '',
    className: '',
    styles: {}
};
module.exports = exports['default'];
},{"prop-types":9,"react":undefined}],13:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var styles = {
        overlay: function overlay(isOpen) {
            return {
                position: 'fixed',
                zIndex: 1,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                opacity: isOpen ? 1 : 0,
                MozTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
                MsTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
                OTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
                WebkitTransform: isOpen ? '' : 'translate3d(100%, 0, 0)',
                transform: isOpen ? '' : 'translate3d(100%, 0, 0)',
                transition: isOpen ? 'opacity 0.3s' : 'opacity 0.3s, transform 0s 0.3s'
            };
        },
        menuWrap: function menuWrap(isOpen, width, right) {
            return {
                position: 'fixed',
                right: right ? 0 : 'inherit',
                zIndex: 2,
                width: width,
                height: '100%',
                MozTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transition: 'all 0.5s'
            };
        },
        menu: function menu() {
            return {
                height: '100%',
                boxSizing: 'border-box',
                overflow: 'auto'
            };
        },
        itemList: function itemList() {
            return { height: '100%' };
        },
        item: function item() {
            return {
                display: 'block',
                outline: 'none'
            };
        },
        burgerIcon: function burgerIcon(isOpen, width, right) {
            return {};
        }
    };
exports['default'] = styles;
module.exports = exports['default'];
},{}],14:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
var _get = function get(_x3, _x4, _x5) {
    var _again = true;
    _function:
        while (_again) {
            var object = _x3, property = _x4, receiver = _x5;
            _again = false;
            if (object === null)
                object = Function.prototype;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === undefined) {
                var parent = Object.getPrototypeOf(object);
                if (parent === null) {
                    return undefined;
                } else {
                    _x3 = parent;
                    _x4 = property;
                    _x5 = receiver;
                    _again = true;
                    desc = parent = undefined;
                    continue _function;
                }
            } else if ('value' in desc) {
                return desc.value;
            } else {
                var getter = desc.get;
                if (getter === undefined) {
                    return undefined;
                }
                return getter.call(receiver);
            }
        }
};
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _propTypes = require('prop-types');
var _propTypes2 = _interopRequireDefault(_propTypes);
var _baseStyles = require('./baseStyles');
var _baseStyles2 = _interopRequireDefault(_baseStyles);
var _BurgerIcon = require('./BurgerIcon');
var _BurgerIcon2 = _interopRequireDefault(_BurgerIcon);
var _CrossIcon = require('./CrossIcon');
var _CrossIcon2 = _interopRequireDefault(_CrossIcon);
exports['default'] = function (styles) {
    var Menu = function (_Component) {
            _inherits(Menu, _Component);
            function Menu(props) {
                _classCallCheck(this, Menu);
                _get(Object.getPrototypeOf(Menu.prototype), 'constructor', this).call(this, props);
                this.state = { isOpen: false };
            }
            _createClass(Menu, [
                {
                    key: 'toggleMenu',
                    value: function toggleMenu() {
                        var _this = this;
                        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                        var isOpen = options.isOpen;
                        var noStateChange = options.noStateChange;
                        var newState = { isOpen: typeof isOpen !== 'undefined' ? isOpen : !this.state.isOpen };
                        this.applyWrapperStyles();
                        this.setState(newState, function () {
                            !noStateChange && _this.props.onStateChange(newState);
                            _this.timeoutId && clearTimeout(_this.timeoutId);
                            _this.timeoutId = setTimeout(function () {
                                _this.timeoutId = null;
                                if (!newState.isOpen) {
                                    _this.applyWrapperStyles(false);
                                }
                            }, 500);
                        });
                    }
                },
                {
                    key: 'applyWrapperStyles',
                    value: function applyWrapperStyles() {
                        var set = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
                        if (this.props.bodyClassName) {
                            var body = document.querySelector('body');
                            body.classList[set ? 'add' : 'remove'](this.props.bodyClassName);
                        }
                        if (styles.pageWrap && this.props.pageWrapId) {
                            this.handleExternalWrapper(this.props.pageWrapId, styles.pageWrap, set);
                        }
                        if (styles.outerContainer && this.props.outerContainerId) {
                            this.handleExternalWrapper(this.props.outerContainerId, styles.outerContainer, set);
                        }
                    }
                },
                {
                    key: 'handleExternalWrapper',
                    value: function handleExternalWrapper(id, wrapperStyles, set) {
                        var html = document.querySelector('html');
                        var body = document.querySelector('body');
                        var wrapper = document.getElementById(id);
                        if (!wrapper) {
                            console.error('Element with ID \'' + id + '\' not found');
                            return;
                        }
                        var builtStyles = this.getStyle(wrapperStyles);
                        for (var prop in builtStyles) {
                            if (builtStyles.hasOwnProperty(prop)) {
                                wrapper.style[prop] = set ? builtStyles[prop] : '';
                            }
                        }
                        [
                            html,
                            body
                        ].forEach(function (element) {
                            element.style['overflow-x'] = set ? 'hidden' : '';
                        });
                    }
                },
                {
                    key: 'getStyles',
                    value: function getStyles(el, index, inline) {
                        var propName = 'bm' + el.replace(el.charAt(0), el.charAt(0).toUpperCase());
                        var output = _baseStyles2['default'][el] ? this.getStyle(_baseStyles2['default'][el]) : {};
                        if (styles[el]) {
                            output = _extends({}, output, this.getStyle(styles[el], index + 1));
                        }
                        if (this.props.styles[propName]) {
                            output = _extends({}, output, this.props.styles[propName]);
                        }
                        if (inline) {
                            output = _extends({}, output, inline);
                        }
                        return output;
                    }
                },
                {
                    key: 'getStyle',
                    value: function getStyle(style, index) {
                        var width = this.props.width;
                        if (typeof width !== 'string')
                            width = width + 'px';
                        return style(this.state.isOpen, width, this.props.right, index);
                    }
                },
                {
                    key: 'listenForClose',
                    value: function listenForClose(e) {
                        e = e || window.event;
                        if (this.state.isOpen && (e.key === 'Escape' || e.keyCode === 27)) {
                            this.toggleMenu();
                        }
                    }
                },
                {
                    key: 'shouldDisableOverlayClick',
                    value: function shouldDisableOverlayClick() {
                        if (typeof this.props.disableOverlayClick === 'function') {
                            return this.props.disableOverlayClick();
                        } else {
                            return this.props.disableOverlayClick;
                        }
                    }
                },
                {
                    key: 'componentWillMount',
                    value: function componentWillMount() {
                        if (!styles) {
                            throw new Error('No styles supplied');
                        }
                    }
                },
                {
                    key: 'componentDidMount',
                    value: function componentDidMount() {
                        window.onkeydown = this.listenForClose.bind(this);
                        if (this.props.isOpen) {
                            this.toggleMenu({
                                isOpen: true,
                                noStateChange: true
                            });
                        }
                    }
                },
                {
                    key: 'componentWillUnmount',
                    value: function componentWillUnmount() {
                        window.onkeydown = null;
                        this.applyWrapperStyles(false);
                    }
                },
                {
                    key: 'componentDidUpdate',
                    value: function componentDidUpdate() {
                        var _this2 = this;
                        if (styles.svg) {
                            (function () {
                                var morphShape = _reactDom2['default'].findDOMNode(_this2, 'bm-morph-shape');
                                var path = styles.svg.lib(morphShape).select('path');
                                if (_this2.state.isOpen) {
                                    styles.svg.animate(path);
                                } else {
                                    setTimeout(function () {
                                        path.attr('d', styles.svg.pathInitial);
                                    }, 300);
                                }
                            }());
                        }
                    }
                },
                {
                    key: 'componentWillReceiveProps',
                    value: function componentWillReceiveProps(nextProps) {
                        if (typeof nextProps.isOpen !== 'undefined' && nextProps.isOpen !== this.state.isOpen) {
                            this.toggleMenu();
                        }
                    }
                },
                {
                    key: 'render',
                    value: function render() {
                        var _this3 = this;
                        return _react2['default'].createElement('div', null, !this.props.noOverlay && _react2['default'].createElement('div', {
                            className: 'bm-overlay ' + this.props.overlayClassName,
                            onClick: function () {
                                return !_this3.shouldDisableOverlayClick() && _this3.toggleMenu();
                            },
                            style: this.getStyles('overlay')
                        }), _react2['default'].createElement('div', {
                            id: this.props.id,
                            className: 'bm-menu-wrap ' + this.props.className,
                            style: this.getStyles('menuWrap')
                        }, styles.svg && _react2['default'].createElement('div', {
                            className: 'bm-morph-shape ' + this.props.morphShapeClassName,
                            style: this.getStyles('morphShape')
                        }, _react2['default'].createElement('svg', {
                            width: '100%',
                            height: '100%',
                            viewBox: '0 0 100 800',
                            preserveAspectRatio: 'none'
                        }, _react2['default'].createElement('path', { d: styles.svg.pathInitial }))), _react2['default'].createElement('div', {
                            className: 'bm-menu ' + this.props.menuClassName,
                            style: this.getStyles('menu')
                        }, _react2['default'].createElement('nav', {
                            className: 'bm-item-list ' + this.props.itemListClassName,
                            style: this.getStyles('itemList')
                        }, _react2['default'].Children.map(this.props.children, function (item, index) {
                            if (item) {
                                var extraProps = {
                                        key: index,
                                        style: _this3.getStyles('item', index, item.props.style)
                                    };
                                return _react2['default'].cloneElement(item, extraProps);
                            }
                        }))), this.props.customCrossIcon !== false && _react2['default'].createElement('div', { style: this.getStyles('closeButton') }, _react2['default'].createElement(_CrossIcon2['default'], {
                            onClick: function () {
                                return _this3.toggleMenu();
                            },
                            styles: this.props.styles,
                            customIcon: this.props.customCrossIcon,
                            className: this.props.crossButtonClassName,
                            crossClassName: this.props.crossClassName
                        }))), this.props.customBurgerIcon !== false && _react2['default'].createElement('div', { style: this.getStyles('burgerIcon') }, _react2['default'].createElement(_BurgerIcon2['default'], {
                            onClick: function () {
                                return _this3.toggleMenu();
                            },
                            styles: this.props.styles,
                            customIcon: this.props.customBurgerIcon,
                            className: this.props.burgerButtonClassName,
                            barClassName: this.props.burgerBarClassName
                        })));
                    }
                }
            ]);
            return Menu;
        }(_react.Component);
    Menu.propTypes = {
        bodyClassName: _propTypes2['default'].string,
        burgerBarClassName: _propTypes2['default'].string,
        burgerButtonClassName: _propTypes2['default'].string,
        crossButtonClassName: _propTypes2['default'].string,
        crossClassName: _propTypes2['default'].string,
        customBurgerIcon: _propTypes2['default'].oneOfType([
            _propTypes2['default'].element,
            _propTypes2['default'].oneOf([false])
        ]),
        customCrossIcon: _propTypes2['default'].oneOfType([
            _propTypes2['default'].element,
            _propTypes2['default'].oneOf([false])
        ]),
        disableOverlayClick: _propTypes2['default'].oneOfType([
            _propTypes2['default'].bool,
            _propTypes2['default'].func
        ]),
        id: _propTypes2['default'].string,
        isOpen: _propTypes2['default'].bool,
        itemListClassName: _propTypes2['default'].string,
        menuClassName: _propTypes2['default'].string,
        morphShapeClassName: _propTypes2['default'].string,
        noOverlay: _propTypes2['default'].bool,
        onStateChange: _propTypes2['default'].func,
        outerContainerId: styles && styles.outerContainer ? _propTypes2['default'].string.isRequired : _propTypes2['default'].string,
        overlayClassName: _propTypes2['default'].string,
        pageWrapId: styles && styles.pageWrap ? _propTypes2['default'].string.isRequired : _propTypes2['default'].string,
        right: _propTypes2['default'].bool,
        styles: _propTypes2['default'].object,
        width: _propTypes2['default'].oneOfType([
            _propTypes2['default'].number,
            _propTypes2['default'].string
        ])
    };
    Menu.defaultProps = {
        bodyClassName: '',
        burgerBarClassName: '',
        burgerButtonClassName: '',
        className: '',
        crossButtonClassName: '',
        crossClassName: '',
        id: '',
        itemListClassName: '',
        menuClassName: '',
        morphShapeClassName: '',
        noOverlay: false,
        onStateChange: function onStateChange() {
        },
        outerContainerId: '',
        overlayClassName: '',
        pageWrapId: '',
        styles: {},
        width: 300
    };
    return Menu;
};
module.exports = exports['default'];
},{"./BurgerIcon":11,"./CrossIcon":12,"./baseStyles":13,"prop-types":9,"react":undefined,"react-dom":undefined}],15:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _snapsvgImporter = require('../snapsvgImporter');
var _snapsvgImporter2 = _interopRequireDefault(_snapsvgImporter);
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        svg: {
            lib: _snapsvgImporter2['default'],
            pathInitial: 'M-7.312,0H0c0,0,0,113.839,0,400c0,264.506,0,400,0,400h-7.312V0z',
            pathOpen: 'M-7.312,0H15c0,0,66,113.339,66,399.5C81,664.006,15,800,15,800H-7.312V0z;M-7.312,0H100c0,0,0,113.839,0,400c0,264.506,0,400,0,400H-7.312V0z',
            animate: function animate(path) {
                var pos = 0;
                var steps = this.pathOpen.split(';');
                var stepsTotal = steps.length;
                var mina = window.mina;
                var nextStep = function nextStep() {
                    if (pos > stepsTotal - 1)
                        return;
                    path.animate({ path: steps[pos] }, pos === 0 ? 400 : 500, pos === 0 ? mina.easein : mina.elastic, function () {
                        nextStep();
                    });
                    pos++;
                };
                nextStep();
            }
        },
        morphShape: function morphShape(isOpen, width, right) {
            return {
                position: 'absolute',
                width: '100%',
                height: '100%',
                right: right ? 'inherit' : 0,
                left: right ? 0 : 'inherit',
                MozTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
                MsTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
                OTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
                WebkitTransform: right ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transform: right ? 'rotateY(180deg)' : 'rotateY(0deg)'
            };
        },
        menuWrap: function menuWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transition: isOpen ? 'transform 0.4s 0s' : 'transform 0.4s'
            };
        },
        menu: function menu(isOpen, width, right) {
            width -= 140;
            return {
                position: 'fixed',
                MozTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transition: isOpen ? 'opacity 0.1s 0.4s cubic-bezier(.17, .67, .1, 1.27), transform 0.1s 0.4s cubic-bezier(.17, .67, .1, 1.27)' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
                opacity: isOpen ? 1 : 0
            };
        },
        item: function item(isOpen, width, right, nthChild) {
            width -= 140;
            return {
                MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transition: isOpen ? 'opacity 0.3s 0.4s, transform 0.3s 0.4s' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
                opacity: isOpen ? 1 : 0
            };
        },
        closeButton: function closeButton(isOpen, width, right) {
            width -= 140;
            return {
                MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transition: isOpen ? 'opacity 0.3s 0.4s cubic-bezier(.17, .67, .1, 1.27), transform 0.3s 0.4s cubic-bezier(.17, .67, .1, 1.27)' : 'opacity 0s 0.3s cubic-bezier(.17, .67, .1, 1.27), transform 0s 0.3s cubic-bezier(.17, .67, .1, 1.27)',
                opacity: isOpen ? 1 : 0
            };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14,"../snapsvgImporter":25}],16:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _snapsvgImporter = require('../snapsvgImporter');
var _snapsvgImporter2 = _interopRequireDefault(_snapsvgImporter);
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        svg: {
            lib: _snapsvgImporter2['default'],
            pathInitial: 'M-1,0h101c0,0-97.833,153.603-97.833,396.167C2.167,627.579,100,800,100,800H-1V0z',
            pathOpen: 'M-1,0h101c0,0,0-1,0,395c0,404,0,405,0,405H-1V0z',
            animate: function animate(path) {
                path.animate({ path: this.pathOpen }, 400, window.mina.easeinout);
            }
        },
        morphShape: function morphShape(isOpen, width, right) {
            return {
                position: 'absolute',
                width: 120,
                height: '100%',
                right: right ? 'inherit' : 0,
                left: right ? 0 : 'inherit',
                MozTransform: right ? 'rotateY(180deg)' : '',
                MsTransform: right ? 'rotateY(180deg)' : '',
                OTransform: right ? 'rotateY(180deg)' : '',
                WebkitTransform: right ? 'rotateY(180deg)' : '',
                transform: right ? 'rotateY(180deg)' : ''
            };
        },
        menuWrap: function menuWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                MsTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                OTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                WebkitTransform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transform: isOpen ? 'translate3d(0, 0, 0)' : right ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)',
                transition: 'all 0.3s'
            };
        },
        menu: function menu(isOpen, width, right) {
            return {
                position: 'fixed',
                right: right ? 0 : 'inherit',
                width: 180,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                overflow: 'visible'
            };
        },
        itemList: function itemList(isOpen, width, right) {
            if (right) {
                return {
                    position: 'relative',
                    left: '-110px',
                    width: '170%',
                    overflow: 'auto'
                };
            }
        },
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(-100px, 0, 0)' : 'translate3d(100px, 0, 0)',
                transition: isOpen ? 'all 0.3s' : 'all 0.3s 0.1s'
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return { overflow: isOpen ? '' : 'hidden' };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14,"../snapsvgImporter":25}],17:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        menuWrap: function menuWrap(isOpen) {
            return {
                MozTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
                MsTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
                OTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
                WebkitTransform: isOpen ? '' : 'translate3d(0, -100%, 0)',
                transform: isOpen ? '' : 'translate3d(0, -100%, 0)',
                transition: 'all 0.5s ease-in-out'
            };
        },
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transition: 'all 0.5s'
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return {
                perspective: '1500px',
                perspectiveOrigin: '0% 50%',
                overflow: isOpen ? '' : 'hidden'
            };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],18:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transition: 'all 0.5s'
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return { overflow: isOpen ? '' : 'hidden' };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],19:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
                OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
                transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0) rotateY(15deg)' : 'translate3d(' + width + ', 0, 0) rotateY(-15deg)',
                transformOrigin: right ? '100% 50%' : '0% 50%',
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s'
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return {
                perspective: '1500px',
                overflow: isOpen ? '' : 'hidden'
            };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],20:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        menuWrap: function menuWrap(isOpen, width, right) {
            return {
                visibility: isOpen ? 'visible' : 'hidden',
                MozTransform: 'translate3d(0, 0, 0)',
                MsTransform: 'translate3d(0, 0, 0)',
                OTransform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                transform: 'translate3d(0, 0, 0)',
                zIndex: 1
            };
        },
        overlay: function overlay(isOpen, width, right) {
            return {
                zIndex: 4,
                MozTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                MsTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                OTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                WebkitTransform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                transform: isOpen ? right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                transition: 'all 0.5s',
                visibility: isOpen ? 'visible' : 'hidden'
            };
        },
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(-' + width + ', 0, 0)' : 'translate3d(' + width + ', 0, 0)',
                transition: 'all 0.5s',
                zIndex: 2,
                position: 'relative'
            };
        },
        burgerIcon: function burgerIcon(isOpen, width, right) {
            return {
                MozTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                MsTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                OTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                WebkitTransform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                transform: isOpen ? right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)' : 'translate3d(0, 0, 0)',
                transition: 'all 0.1s',
                position: 'relative',
                zIndex: 3
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return { overflow: isOpen ? '' : 'hidden' };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],21:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        pageWrap: function pageWrap(isOpen, width) {
            return {
                MozTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
                MsTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
                OTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
                WebkitTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
                transform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
                transformOrigin: '100%',
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s'
            };
        },
        outerContainer: function outerContainer() {
            return { perspective: '1500px' };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],22:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        pageWrap: function pageWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
                MsTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
                OTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
                transform: isOpen ? '' : right ? 'translate3d(-100px, 0, -600px) rotateY(20deg)' : 'translate3d(100px, 0, -600px) rotateY(-20deg)',
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s',
                overflow: isOpen ? '' : 'hidden'
            };
        },
        outerContainer: function outerContainer(isOpen) {
            return {
                perspective: '1500px',
                overflow: isOpen ? '' : 'hidden'
            };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],23:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {};
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],24:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var _menuFactory = require('../menuFactory');
var _menuFactory2 = _interopRequireDefault(_menuFactory);
var styles = {
        menuWrap: function menuWrap(isOpen, width, right) {
            return {
                MozTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                MsTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                OTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                WebkitTransform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transform: isOpen ? '' : right ? 'translate3d(' + width + ', 0, 0)' : 'translate3d(-' + width + ', 0, 0)',
                transition: isOpen ? 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)' : 'transform 0.4s cubic-bezier(0.7, 0, 0.3, 1)'
            };
        },
        item: function item(isOpen, width, right, nthChild) {
            return {
                MozTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
                MsTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
                OTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
                WebkitTransform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
                transform: isOpen ? '' : 'translate3d(0, ' + nthChild * 500 + 'px, 0)',
                transition: isOpen ? 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)' : 'transform 0s 0.2s cubic-bezier(0.7, 0, 0.3, 1)'
            };
        }
    };
exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
},{"../menuFactory":14}],25:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports['default'] = function () {
    var Snap = undefined;
    try {
        Snap = require('snapsvg-cjs');
    } finally {
        return Snap;
    }
};
module.exports = exports['default'];
},{"snapsvg-cjs":undefined}],"react-burger-menu":[function(require,module,exports){
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports['default'] = {
    slide: require('./menus/slide'),
    stack: require('./menus/stack'),
    elastic: require('./menus/elastic'),
    bubble: require('./menus/bubble'),
    push: require('./menus/push'),
    pushRotate: require('./menus/pushRotate'),
    scaleDown: require('./menus/scaleDown'),
    scaleRotate: require('./menus/scaleRotate'),
    fallDown: require('./menus/fallDown'),
    reveal: require('./menus/reveal')
};
module.exports = exports['default'];
},{"./menus/bubble":15,"./menus/elastic":16,"./menus/fallDown":17,"./menus/push":18,"./menus/pushRotate":19,"./menus/reveal":20,"./menus/scaleDown":21,"./menus/scaleRotate":22,"./menus/slide":23,"./menus/stack":24}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2NoZWNrUHJvcFR5cGVzLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsInNyYy9CdXJnZXJJY29uLmpzIiwic3JjL0Nyb3NzSWNvbi5qcyIsInNyYy9iYXNlU3R5bGVzLmpzIiwic3JjL21lbnVGYWN0b3J5LmpzIiwic3JjL21lbnVzL2J1YmJsZS5qcyIsInNyYy9tZW51cy9lbGFzdGljLmpzIiwic3JjL21lbnVzL2ZhbGxEb3duLmpzIiwic3JjL21lbnVzL3B1c2guanMiLCJzcmMvbWVudXMvcHVzaFJvdGF0ZS5qcyIsInNyYy9tZW51cy9yZXZlYWwuanMiLCJzcmMvbWVudXMvc2NhbGVEb3duLmpzIiwic3JjL21lbnVzL3NjYWxlUm90YXRlLmpzIiwic3JjL21lbnVzL3NsaWRlLmpzIiwic3JjL21lbnVzL3N0YWNrLmpzIiwic3JjL3NuYXBzdmdJbXBvcnRlci5qcyIsInNyYy9CdXJnZXJNZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzloQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFsaWRhdGVGb3JtYXQgPSBmdW5jdGlvbiB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICB2YWxpZGF0ZUZvcm1hdChmb3JtYXQpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9lbXB0eUZ1bmN0aW9uJyk7XG5cbi8qKlxuICogU2ltaWxhciB0byBpbnZhcmlhbnQgYnV0IG9ubHkgbG9ncyBhIHdhcm5pbmcgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0LlxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBsb2cgaXNzdWVzIGluIGRldmVsb3BtZW50IGVudmlyb25tZW50cyBpbiBjcml0aWNhbFxuICogcGF0aHMuIFJlbW92aW5nIHRoZSBsb2dnaW5nIGNvZGUgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzIHdpbGwga2VlcCB0aGVcbiAqIHNhbWUgbG9naWMgYW5kIGZvbGxvdyB0aGUgc2FtZSBjb2RlIHBhdGhzLlxuICovXG5cbnZhciB3YXJuaW5nID0gZW1wdHlGdW5jdGlvbjtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICB9KTtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7fVxuICB9O1xuXG4gIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0LCAuLi5hcmdzKWAgcmVxdWlyZXMgYSB3YXJuaW5nICcgKyAnbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cblxuICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgIHJldHVybjsgLy8gSWdub3JlIENvbXBvc2l0ZUNvbXBvbmVudCBwcm9wdHlwZSBjaGVjay5cbiAgICB9XG5cbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAyID8gX2xlbjIgLSAyIDogMCksIF9rZXkyID0gMjsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICBwcmludFdhcm5pbmcuYXBwbHkodW5kZWZpbmVkLCBbZm9ybWF0XS5jb25jYXQoYXJncykpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbiAgdmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbn1cblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/RnVuY3Rpb259IGdldFN0YWNrIFJldHVybnMgdGhlIGNvbXBvbmVudCBzdGFjay5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUHJvcFR5cGVzKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZ2V0U3RhY2spIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgICBpZiAodHlwZVNwZWNzLmhhc093blByb3BlcnR5KHR5cGVTcGVjTmFtZSkpIHtcbiAgICAgICAgdmFyIGVycm9yO1xuICAgICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAvLyBmYWlsIHRoZSByZW5kZXIgcGhhc2Ugd2hlcmUgaXQgZGlkbid0IGZhaWwgYmVmb3JlLiBTbyB3ZSBsb2cgaXQuXG4gICAgICAgIC8vIEFmdGVyIHRoZXNlIGhhdmUgYmVlbiBjbGVhbmVkIHVwLCB3ZSdsbCBsZXQgdGhlbSB0aHJvdy5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUaGlzIGlzIGludGVudGlvbmFsbHkgYW4gaW52YXJpYW50IHRoYXQgZ2V0cyBjYXVnaHQuIEl0J3MgdGhlIHNhbWVcbiAgICAgICAgICAvLyBiZWhhdmlvciBhcyB3aXRob3V0IHRoaXMgc3RhdGVtZW50IGV4Y2VwdCB3aXRoIGEgYmV0dGVyIG1lc3NhZ2UuXG4gICAgICAgICAgaW52YXJpYW50KHR5cGVvZiB0eXBlU3BlY3NbdHlwZVNwZWNOYW1lXSA9PT0gJ2Z1bmN0aW9uJywgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gJyArICd0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UsIGJ1dCByZWNlaXZlZCBgJXNgLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKTtcbiAgICAgICAgICBlcnJvciA9IHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdKHZhbHVlcywgdHlwZVNwZWNOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgbnVsbCwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGVycm9yID0gZXg7XG4gICAgICAgIH1cbiAgICAgICAgd2FybmluZyghZXJyb3IgfHwgZXJyb3IgaW5zdGFuY2VvZiBFcnJvciwgJyVzOiB0eXBlIHNwZWNpZmljYXRpb24gb2YgJXMgYCVzYCBpcyBpbnZhbGlkOyB0aGUgdHlwZSBjaGVja2VyICcgKyAnZnVuY3Rpb24gbXVzdCByZXR1cm4gYG51bGxgIG9yIGFuIGBFcnJvcmAgYnV0IHJldHVybmVkIGEgJXMuICcgKyAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArICdjcmVhdG9yIChhcnJheU9mLCBpbnN0YW5jZU9mLCBvYmplY3RPZiwgb25lT2YsIG9uZU9mVHlwZSwgYW5kICcgKyAnc2hhcGUgYWxsIHJlcXVpcmUgYW4gYXJndW1lbnQpLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgbG9jYXRpb24sIHR5cGVTcGVjTmFtZSwgdHlwZW9mIGVycm9yKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHdhcm5pbmcoZmFsc2UsICdGYWlsZWQgJXMgdHlwZTogJXMlcycsIGxvY2F0aW9uLCBlcnJvci5tZXNzYWdlLCBzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNoaW0ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICBpZiAoc2VjcmV0ID09PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgLy8gSXQgaXMgc3RpbGwgc2FmZSB3aGVuIGNhbGxlZCBmcm9tIFJlYWN0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICdVc2UgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKCkgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICk7XG4gIH07XG4gIHNoaW0uaXNSZXF1aXJlZCA9IHNoaW07XG4gIGZ1bmN0aW9uIGdldFNoaW0oKSB7XG4gICAgcmV0dXJuIHNoaW07XG4gIH07XG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogc2hpbSxcbiAgICBib29sOiBzaGltLFxuICAgIGZ1bmM6IHNoaW0sXG4gICAgbnVtYmVyOiBzaGltLFxuICAgIG9iamVjdDogc2hpbSxcbiAgICBzdHJpbmc6IHNoaW0sXG4gICAgc3ltYm9sOiBzaGltLFxuXG4gICAgYW55OiBzaGltLFxuICAgIGFycmF5T2Y6IGdldFNoaW0sXG4gICAgZWxlbWVudDogc2hpbSxcbiAgICBpbnN0YW5jZU9mOiBnZXRTaGltLFxuICAgIG5vZGU6IHNoaW0sXG4gICAgb2JqZWN0T2Y6IGdldFNoaW0sXG4gICAgb25lT2Y6IGdldFNoaW0sXG4gICAgb25lT2ZUeXBlOiBnZXRTaGltLFxuICAgIHNoYXBlOiBnZXRTaGltLFxuICAgIGV4YWN0OiBnZXRTaGltXG4gIH07XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBlbXB0eUZ1bmN0aW9uO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBlbXB0eUZ1bmN0aW9uID0gcmVxdWlyZSgnZmJqcy9saWIvZW1wdHlGdW5jdGlvbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyLFxuICAgIGV4YWN0OiBjcmVhdGVTdHJpY3RTaGFwZVR5cGVDaGVja2VyLFxuICB9O1xuXG4gIC8qKlxuICAgKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICAgKi9cbiAgLyplc2xpbnQtZGlzYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICByZXR1cm4geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgIH1cbiAgfVxuICAvKmVzbGludC1lbmFibGUgbm8tc2VsZi1jb21wYXJlKi9cblxuICAvKipcbiAgICogV2UgdXNlIGFuIEVycm9yLWxpa2Ugb2JqZWN0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGFzIHBlb3BsZSBtYXkgY2FsbFxuICAgKiBQcm9wVHlwZXMgZGlyZWN0bHkgYW5kIGluc3BlY3QgdGhlaXIgb3V0cHV0LiBIb3dldmVyLCB3ZSBkb24ndCB1c2UgcmVhbFxuICAgKiBFcnJvcnMgYW55bW9yZS4gV2UgZG9uJ3QgaW5zcGVjdCB0aGVpciBzdGFjayBhbnl3YXksIGFuZCBjcmVhdGluZyB0aGVtXG4gICAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAgICogaGFwcGVucyBpbiBvbmVPZlR5cGUoKSBmb3IgYW55IHR5cGUgYmVmb3JlIHRoZSBvbmUgdGhhdCBtYXRjaGVkLlxuICAgKi9cbiAgZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnN0YWNrID0gJyc7XG4gIH1cbiAgLy8gTWFrZSBgaW5zdGFuY2VvZiBFcnJvcmAgc3RpbGwgd29yayBmb3IgcmV0dXJuZWQgZXJyb3JzLlxuICBQcm9wVHlwZUVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuICBmdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGUgPSB7fTtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA9IDA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuXG4gICAgICBpZiAoc2VjcmV0ICE9PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgICBpZiAodGhyb3dPbkRpcmVjdEFjY2Vzcykge1xuICAgICAgICAgIC8vIE5ldyBiZWhhdmlvciBvbmx5IGZvciB1c2VycyBvZiBgcHJvcC10eXBlc2AgcGFja2FnZVxuICAgICAgICAgIGludmFyaWFudChcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gT2xkIGJlaGF2aW9yIGZvciBwZW9wbGUgdXNpbmcgUmVhY3QuUHJvcFR5cGVzXG4gICAgICAgICAgdmFyIGNhY2hlS2V5ID0gY29tcG9uZW50TmFtZSArICc6JyArIHByb3BOYW1lO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFtYW51YWxQcm9wVHlwZUNhbGxDYWNoZVtjYWNoZUtleV0gJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIHNwYW1taW5nIHRoZSBjb25zb2xlIGJlY2F1c2UgdGhleSBhcmUgb2Z0ZW4gbm90IGFjdGlvbmFibGUgZXhjZXB0IGZvciBsaWIgYXV0aG9yc1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPCAzXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJXNgIHByb3Agb24gYCVzYC4gVGhpcyBpcyBkZXByZWNhdGVkICcgK1xuICAgICAgICAgICAgICAnYW5kIHdpbGwgdGhyb3cgaW4gdGhlIHN0YW5kYWxvbmUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgICAnWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyAnICtcbiAgICAgICAgICAgICAgJ2xpYnJhcnkuIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyAnICsgJ2ZvciBkZXRhaWxzLicsXG4gICAgICAgICAgICAgIHByb3BGdWxsTmFtZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbCk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgcHJvcFZhbHVlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIG9uZSBvZiAnICsgdmFsdWVzU3RyaW5nICsgJy4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB3YXJuaW5nKFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICVzIGF0IGluZGV4ICVzLicsXG4gICAgICAgICAgZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKGNoZWNrZXIpLFxuICAgICAgICAgIGlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tXG4gICAgICAvLyBwcm9wcy5cbiAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGFsbEtleXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKVxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aWNQcm9wcylcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgICAgIH07XG4gICAgfSgpO1xudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7XG4gICAgdmFyIF9hZ2FpbiA9IHRydWU7XG4gICAgX2Z1bmN0aW9uOlxuICAgICAgICB3aGlsZSAoX2FnYWluKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MztcbiAgICAgICAgICAgIF9hZ2FpbiA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gICAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIF94MyA9IHJlY2VpdmVyO1xuICAgICAgICAgICAgICAgICAgICBfYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBkZXNjID0gcGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBfZnVuY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59O1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgICB9XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3VwZXJDbGFzcylcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59XG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xudmFyIEJ1cmdlckljb24gPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgICAgICBfaW5oZXJpdHMoQnVyZ2VySWNvbiwgX0NvbXBvbmVudCk7XG4gICAgICAgIGZ1bmN0aW9uIEJ1cmdlckljb24ocHJvcHMpIHtcbiAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCdXJnZXJJY29uKTtcbiAgICAgICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKEJ1cmdlckljb24ucHJvdG90eXBlKSwgJ2NvbnN0cnVjdG9yJywgdGhpcykuY2FsbCh0aGlzLCBwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0geyBob3ZlcjogZmFsc2UgfTtcbiAgICAgICAgfVxuICAgICAgICBfY3JlYXRlQ2xhc3MoQnVyZ2VySWNvbiwgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogJ2dldExpbmVTdHlsZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldExpbmVTdHlsZShpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAyMCAqIChpbmRleCAqIDIpICsgJyUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogdGhpcy5zdGF0ZS5ob3ZlciA/IDAuNiA6IDFcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGljb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidXR0b25TdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmN1c3RvbUljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYVByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1pY29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLnByb3BzLnN0eWxlcy5ibUljb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY2xvbmVFbGVtZW50KHRoaXMucHJvcHMuY3VzdG9tSWNvbiwgZXh0cmFQcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCBudWxsLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0ubWFwKGZ1bmN0aW9uIChiYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogYmFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1idXJnZXItYmFycyAnICsgX3RoaXMucHJvcHMuYmFyQ2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoe30sIF90aGlzLmdldExpbmVTdHlsZShiYXIpLCBfdGhpcy5wcm9wcy5zdHlsZXMuYm1CdXJnZXJCYXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYm0tYnVyZ2VyLWJ1dHRvbiAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogX2V4dGVuZHMoeyB6SW5kZXg6IDEgfSwgdGhpcy5wcm9wcy5zdHlsZXMuYm1CdXJnZXJCdXR0b24pXG4gICAgICAgICAgICAgICAgICAgIH0sIGljb24sIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLm9uQ2xpY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlT3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5zZXRTdGF0ZSh7IGhvdmVyOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTW91c2VPdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuc2V0U3RhdGUoeyBob3ZlcjogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGJ1dHRvblN0eWxlXG4gICAgICAgICAgICAgICAgICAgIH0sICdPcGVuIE1lbnUnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIEJ1cmdlckljb247XG4gICAgfShfcmVhY3QuQ29tcG9uZW50KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEJ1cmdlckljb247XG5CdXJnZXJJY29uLnByb3BUeXBlcyA9IHtcbiAgICBiYXJDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgIGN1c3RvbUljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZWxlbWVudCxcbiAgICBzdHlsZXM6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub2JqZWN0XG59O1xuQnVyZ2VySWNvbi5kZWZhdWx0UHJvcHMgPSB7XG4gICAgYmFyQ2xhc3NOYW1lOiAnJyxcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIHN0eWxlczoge31cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKVxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgICAgICAgIGlmIChzdGF0aWNQcm9wcylcbiAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgICAgIH07XG4gICAgfSgpO1xudmFyIF9nZXQgPSBmdW5jdGlvbiBnZXQoX3gsIF94MiwgX3gzKSB7XG4gICAgdmFyIF9hZ2FpbiA9IHRydWU7XG4gICAgX2Z1bmN0aW9uOlxuICAgICAgICB3aGlsZSAoX2FnYWluKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3gsIHByb3BlcnR5ID0gX3gyLCByZWNlaXZlciA9IF94MztcbiAgICAgICAgICAgIF9hZ2FpbiA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gICAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfeCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgX3gyID0gcHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIF94MyA9IHJlY2VpdmVyO1xuICAgICAgICAgICAgICAgICAgICBfYWdhaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBkZXNjID0gcGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBfZnVuY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgndmFsdWUnIGluIGRlc2MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuICAgICAgICAgICAgICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59O1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgICB9XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoc3VwZXJDbGFzcylcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59XG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xudmFyIF9wcm9wVHlwZXMgPSByZXF1aXJlKCdwcm9wLXR5cGVzJyk7XG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xudmFyIENyb3NzSWNvbiA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gICAgICAgIF9pbmhlcml0cyhDcm9zc0ljb24sIF9Db21wb25lbnQpO1xuICAgICAgICBmdW5jdGlvbiBDcm9zc0ljb24oKSB7XG4gICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3Jvc3NJY29uKTtcbiAgICAgICAgICAgIF9nZXQoT2JqZWN0LmdldFByb3RvdHlwZU9mKENyb3NzSWNvbi5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIF9jcmVhdGVDbGFzcyhDcm9zc0ljb24sIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6ICdnZXRDcm9zc1N0eWxlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q3Jvc3NTdHlsZSh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHlwZSA9PT0gJ2JlZm9yZScgPyAncm90YXRlKDQ1ZGVnKScgOiAncm90YXRlKC00NWRlZyknXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpY29uO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uV3JhcHBlclN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiA4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogOFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1dHRvblN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEluZGVudDogLTk5OTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmN1c3RvbUljb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYVByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1jcm9zcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5wcm9wcy5zdHlsZXMuYm1Dcm9zcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbiA9IF9yZWFjdDJbJ2RlZmF1bHQnXS5jbG9uZUVsZW1lbnQodGhpcy5wcm9wcy5jdXN0b21JY29uLCBleHRyYVByb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICcxNHB4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYWZ0ZXInXG4gICAgICAgICAgICAgICAgICAgICAgICBdLm1hcChmdW5jdGlvbiAodHlwZSwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1jcm9zcyAnICsgX3RoaXMucHJvcHMuY3Jvc3NDbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBfZXh0ZW5kcyh7fSwgX3RoaXMuZ2V0Q3Jvc3NTdHlsZSh0eXBlKSwgX3RoaXMucHJvcHMuc3R5bGVzLmJtQ3Jvc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1jcm9zcy1idXR0b24gJyArIHRoaXMucHJvcHMuY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IF9leHRlbmRzKHt9LCBidXR0b25XcmFwcGVyU3R5bGUsIHRoaXMucHJvcHMuc3R5bGVzLmJtQ3Jvc3NCdXR0b24pXG4gICAgICAgICAgICAgICAgICAgIH0sIGljb24sIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLm9uQ2xpY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogYnV0dG9uU3R5bGVcbiAgICAgICAgICAgICAgICAgICAgfSwgJ0Nsb3NlIE1lbnUnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIENyb3NzSWNvbjtcbiAgICB9KF9yZWFjdC5Db21wb25lbnQpO1xuZXhwb3J0c1snZGVmYXVsdCddID0gQ3Jvc3NJY29uO1xuQ3Jvc3NJY29uLnByb3BUeXBlcyA9IHtcbiAgICBjcm9zc0NsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgY3VzdG9tSWNvbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5lbGVtZW50LFxuICAgIHN0eWxlczogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vYmplY3Rcbn07XG5Dcm9zc0ljb24uZGVmYXVsdFByb3BzID0ge1xuICAgIGNyb3NzQ2xhc3NOYW1lOiAnJyxcbiAgICBjbGFzc05hbWU6ICcnLFxuICAgIHN0eWxlczoge31cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0eWxlcyA9IHtcbiAgICAgICAgb3ZlcmxheTogZnVuY3Rpb24gb3ZlcmxheShpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMC4zKScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDAsXG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ29wYWNpdHkgMC4zcycgOiAnb3BhY2l0eSAwLjNzLCB0cmFuc2Zvcm0gMHMgMC4zcydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICByaWdodDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgICAgICAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgICAgICAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBtZW51OiBmdW5jdGlvbiBtZW51KCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2F1dG8nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBpdGVtTGlzdDogZnVuY3Rpb24gaXRlbUxpc3QoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBoZWlnaHQ6ICcxMDAlJyB9O1xuICAgICAgICB9LFxuICAgICAgICBpdGVtOiBmdW5jdGlvbiBpdGVtKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICAgIG91dGxpbmU6ICdub25lJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgYnVyZ2VySWNvbjogZnVuY3Rpb24gYnVyZ2VySWNvbihpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHN0eWxlcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3RvUHJvcHMpXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgICAgICAgaWYgKHN0YXRpY1Byb3BzKVxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgICAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICAgICAgfTtcbiAgICB9KCk7XG52YXIgX2dldCA9IGZ1bmN0aW9uIGdldChfeDMsIF94NCwgX3g1KSB7XG4gICAgdmFyIF9hZ2FpbiA9IHRydWU7XG4gICAgX2Z1bmN0aW9uOlxuICAgICAgICB3aGlsZSAoX2FnYWluKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gX3gzLCBwcm9wZXJ0eSA9IF94NCwgcmVjZWl2ZXIgPSBfeDU7XG4gICAgICAgICAgICBfYWdhaW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvYmplY3QgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3gzID0gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICBfeDQgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgX3g1ID0gcmVjZWl2ZXI7XG4gICAgICAgICAgICAgICAgICAgIF9hZ2FpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGRlc2MgPSBwYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIF9mdW5jdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG4gICAgICAgICAgICAgICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbn07XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07XG59XG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICAgIH1cbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChzdXBlckNsYXNzKVxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn1cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG52YXIgX3JlYWN0RG9tID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xudmFyIF9wcm9wVHlwZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvcFR5cGVzKTtcbnZhciBfYmFzZVN0eWxlcyA9IHJlcXVpcmUoJy4vYmFzZVN0eWxlcycpO1xudmFyIF9iYXNlU3R5bGVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Jhc2VTdHlsZXMpO1xudmFyIF9CdXJnZXJJY29uID0gcmVxdWlyZSgnLi9CdXJnZXJJY29uJyk7XG52YXIgX0J1cmdlckljb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQnVyZ2VySWNvbik7XG52YXIgX0Nyb3NzSWNvbiA9IHJlcXVpcmUoJy4vQ3Jvc3NJY29uJyk7XG52YXIgX0Nyb3NzSWNvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Dcm9zc0ljb24pO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZnVuY3Rpb24gKHN0eWxlcykge1xuICAgIHZhciBNZW51ID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICAgICAgICAgIF9pbmhlcml0cyhNZW51LCBfQ29tcG9uZW50KTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIE1lbnUocHJvcHMpIHtcbiAgICAgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWVudSk7XG4gICAgICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoTWVudS5wcm90b3R5cGUpLCAnY29uc3RydWN0b3InLCB0aGlzKS5jYWxsKHRoaXMsIHByb3BzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0geyBpc09wZW46IGZhbHNlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfY3JlYXRlQ2xhc3MoTWVudSwgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndG9nZ2xlTWVudScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNPcGVuID0gb3B0aW9ucy5pc09wZW47XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9TdGF0ZUNoYW5nZSA9IG9wdGlvbnMubm9TdGF0ZUNoYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdTdGF0ZSA9IHsgaXNPcGVuOiB0eXBlb2YgaXNPcGVuICE9PSAndW5kZWZpbmVkJyA/IGlzT3BlbiA6ICF0aGlzLnN0YXRlLmlzT3BlbiB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBseVdyYXBwZXJTdHlsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhbm9TdGF0ZUNoYW5nZSAmJiBfdGhpcy5wcm9wcy5vblN0YXRlQ2hhbmdlKG5ld1N0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy50aW1lb3V0SWQgJiYgY2xlYXJUaW1lb3V0KF90aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnRpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbmV3U3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5hcHBseVdyYXBwZXJTdHlsZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2FwcGx5V3JhcHBlclN0eWxlcycsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBseVdyYXBwZXJTdHlsZXMoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmJvZHlDbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5LmNsYXNzTGlzdFtzZXQgPyAnYWRkJyA6ICdyZW1vdmUnXSh0aGlzLnByb3BzLmJvZHlDbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlcy5wYWdlV3JhcCAmJiB0aGlzLnByb3BzLnBhZ2VXcmFwSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV4dGVybmFsV3JhcHBlcih0aGlzLnByb3BzLnBhZ2VXcmFwSWQsIHN0eWxlcy5wYWdlV3JhcCwgc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHlsZXMub3V0ZXJDb250YWluZXIgJiYgdGhpcy5wcm9wcy5vdXRlckNvbnRhaW5lcklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFeHRlcm5hbFdyYXBwZXIodGhpcy5wcm9wcy5vdXRlckNvbnRhaW5lcklkLCBzdHlsZXMub3V0ZXJDb250YWluZXIsIHNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnaGFuZGxlRXh0ZXJuYWxXcmFwcGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUV4dGVybmFsV3JhcHBlcihpZCwgd3JhcHBlclN0eWxlcywgc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXdyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFbGVtZW50IHdpdGggSUQgXFwnJyArIGlkICsgJ1xcJyBub3QgZm91bmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYnVpbHRTdHlsZXMgPSB0aGlzLmdldFN0eWxlKHdyYXBwZXJTdHlsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBidWlsdFN0eWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWlsdFN0eWxlcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlW3Byb3BdID0gc2V0ID8gYnVpbHRTdHlsZXNbcHJvcF0gOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICBdLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlWydvdmVyZmxvdy14J10gPSBzZXQgPyAnaGlkZGVuJyA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnZ2V0U3R5bGVzJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0eWxlcyhlbCwgaW5kZXgsIGlubGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gJ2JtJyArIGVsLnJlcGxhY2UoZWwuY2hhckF0KDApLCBlbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3V0cHV0ID0gX2Jhc2VTdHlsZXMyWydkZWZhdWx0J11bZWxdID8gdGhpcy5nZXRTdHlsZShfYmFzZVN0eWxlczJbJ2RlZmF1bHQnXVtlbF0pIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGVzW2VsXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IF9leHRlbmRzKHt9LCBvdXRwdXQsIHRoaXMuZ2V0U3R5bGUoc3R5bGVzW2VsXSwgaW5kZXggKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wcy5zdHlsZXNbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gX2V4dGVuZHMoe30sIG91dHB1dCwgdGhpcy5wcm9wcy5zdHlsZXNbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBfZXh0ZW5kcyh7fSwgb3V0cHV0LCBpbmxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdnZXRTdHlsZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdHlsZShzdHlsZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9IHRoaXMucHJvcHMud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHdpZHRoICE9PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IHdpZHRoICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZSh0aGlzLnN0YXRlLmlzT3Blbiwgd2lkdGgsIHRoaXMucHJvcHMucmlnaHQsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdsaXN0ZW5Gb3JDbG9zZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW5Gb3JDbG9zZShlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc09wZW4gJiYgKGUua2V5ID09PSAnRXNjYXBlJyB8fCBlLmtleUNvZGUgPT09IDI3KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3Nob3VsZERpc2FibGVPdmVybGF5Q2xpY2snLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdWxkRGlzYWJsZU92ZXJsYXlDbGljaygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wcm9wcy5kaXNhYmxlT3ZlcmxheUNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlzYWJsZU92ZXJsYXlDbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNhYmxlT3ZlcmxheUNsaWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxNb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0eWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc3R5bGVzIHN1cHBsaWVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25rZXlkb3duID0gdGhpcy5saXN0ZW5Gb3JDbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGVNZW51KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPcGVuOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1N0YXRlQ2hhbmdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub25rZXlkb3duID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlXcmFwcGVyU3R5bGVzKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdjb21wb25lbnREaWRVcGRhdGUnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGVzLnN2Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb3JwaFNoYXBlID0gX3JlYWN0RG9tMlsnZGVmYXVsdCddLmZpbmRET01Ob2RlKF90aGlzMiwgJ2JtLW1vcnBoLXNoYXBlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXRoID0gc3R5bGVzLnN2Zy5saWIobW9ycGhTaGFwZSkuc2VsZWN0KCdwYXRoJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpczIuc3RhdGUuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXMuc3ZnLmFuaW1hdGUocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoLmF0dHIoJ2QnLCBzdHlsZXMuc3ZnLnBhdGhJbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmV4dFByb3BzLmlzT3BlbiAhPT0gJ3VuZGVmaW5lZCcgJiYgbmV4dFByb3BzLmlzT3BlbiAhPT0gdGhpcy5zdGF0ZS5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZU1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIG51bGwsICF0aGlzLnByb3BzLm5vT3ZlcmxheSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JtLW92ZXJsYXkgJyArIHRoaXMucHJvcHMub3ZlcmxheUNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhX3RoaXMzLnNob3VsZERpc2FibGVPdmVybGF5Q2xpY2soKSAmJiBfdGhpczMudG9nZ2xlTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0U3R5bGVzKCdvdmVybGF5JylcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JtLW1lbnUtd3JhcCAnICsgdGhpcy5wcm9wcy5jbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0U3R5bGVzKCdtZW51V3JhcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBzdHlsZXMuc3ZnICYmIF9yZWFjdDJbJ2RlZmF1bHQnXS5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYm0tbW9ycGgtc2hhcGUgJyArIHRoaXMucHJvcHMubW9ycGhTaGFwZUNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogdGhpcy5nZXRTdHlsZXMoJ21vcnBoU2hhcGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ3N2ZycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdCb3g6ICcwIDAgMTAwIDgwMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbzogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogc3R5bGVzLnN2Zy5wYXRoSW5pdGlhbCB9KSkpLCBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2JtLW1lbnUgJyArIHRoaXMucHJvcHMubWVudUNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogdGhpcy5nZXRTdHlsZXMoJ21lbnUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoJ25hdicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdibS1pdGVtLWxpc3QgJyArIHRoaXMucHJvcHMuaXRlbUxpc3RDbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0U3R5bGVzKCdpdGVtTGlzdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBfcmVhY3QyWydkZWZhdWx0J10uQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYVByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IF90aGlzMy5nZXRTdHlsZXMoJ2l0ZW0nLCBpbmRleCwgaXRlbS5wcm9wcy5zdHlsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY2xvbmVFbGVtZW50KGl0ZW0sIGV4dHJhUHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSksIHRoaXMucHJvcHMuY3VzdG9tQ3Jvc3NJY29uICE9PSBmYWxzZSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogdGhpcy5nZXRTdHlsZXMoJ2Nsb3NlQnV0dG9uJykgfSwgX3JlYWN0MlsnZGVmYXVsdCddLmNyZWF0ZUVsZW1lbnQoX0Nyb3NzSWNvbjJbJ2RlZmF1bHQnXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMy50b2dnbGVNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IHRoaXMucHJvcHMuc3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUljb246IHRoaXMucHJvcHMuY3VzdG9tQ3Jvc3NJY29uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jcm9zc0J1dHRvbkNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcm9zc0NsYXNzTmFtZTogdGhpcy5wcm9wcy5jcm9zc0NsYXNzTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSwgdGhpcy5wcm9wcy5jdXN0b21CdXJnZXJJY29uICE9PSBmYWxzZSAmJiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudCgnZGl2JywgeyBzdHlsZTogdGhpcy5nZXRTdHlsZXMoJ2J1cmdlckljb24nKSB9LCBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChfQnVyZ2VySWNvbjJbJ2RlZmF1bHQnXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzMy50b2dnbGVNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IHRoaXMucHJvcHMuc3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbUljb246IHRoaXMucHJvcHMuY3VzdG9tQnVyZ2VySWNvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuYnVyZ2VyQnV0dG9uQ2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhckNsYXNzTmFtZTogdGhpcy5wcm9wcy5idXJnZXJCYXJDbGFzc05hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHJldHVybiBNZW51O1xuICAgICAgICB9KF9yZWFjdC5Db21wb25lbnQpO1xuICAgIE1lbnUucHJvcFR5cGVzID0ge1xuICAgICAgICBib2R5Q2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICAgICAgYnVyZ2VyQmFyQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICAgICAgYnVyZ2VyQnV0dG9uQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICAgICAgY3Jvc3NCdXR0b25DbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgICAgICBjcm9zc0NsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgICAgIGN1c3RvbUJ1cmdlckljb246IF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZWxlbWVudCxcbiAgICAgICAgICAgIF9wcm9wVHlwZXMyWydkZWZhdWx0J10ub25lT2YoW2ZhbHNlXSlcbiAgICAgICAgXSksXG4gICAgICAgIGN1c3RvbUNyb3NzSWNvbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5lbGVtZW50LFxuICAgICAgICAgICAgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vbmVPZihbZmFsc2VdKVxuICAgICAgICBdKSxcbiAgICAgICAgZGlzYWJsZU92ZXJsYXlDbGljazogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgICAgICAgICAgX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5mdW5jXG4gICAgICAgIF0pLFxuICAgICAgICBpZDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgICAgIGlzT3BlbjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5ib29sLFxuICAgICAgICBpdGVtTGlzdENsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgICAgIG1lbnVDbGFzc05hbWU6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLFxuICAgICAgICBtb3JwaFNoYXBlQ2xhc3NOYW1lOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICAgICAgbm9PdmVybGF5OiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgICAgIG9uU3RhdGVDaGFuZ2U6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZnVuYyxcbiAgICAgICAgb3V0ZXJDb250YWluZXJJZDogc3R5bGVzICYmIHN0eWxlcy5vdXRlckNvbnRhaW5lciA/IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nLmlzUmVxdWlyZWQgOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgICAgICAgb3ZlcmxheUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgICAgIHBhZ2VXcmFwSWQ6IHN0eWxlcyAmJiBzdHlsZXMucGFnZVdyYXAgPyBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZy5pc1JlcXVpcmVkIDogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gICAgICAgIHJpZ2h0OiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gICAgICAgIHN0eWxlczogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5vYmplY3QsXG4gICAgICAgIHdpZHRoOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm51bWJlcixcbiAgICAgICAgICAgIF9wcm9wVHlwZXMyWydkZWZhdWx0J10uc3RyaW5nXG4gICAgICAgIF0pXG4gICAgfTtcbiAgICBNZW51LmRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgYm9keUNsYXNzTmFtZTogJycsXG4gICAgICAgIGJ1cmdlckJhckNsYXNzTmFtZTogJycsXG4gICAgICAgIGJ1cmdlckJ1dHRvbkNsYXNzTmFtZTogJycsXG4gICAgICAgIGNsYXNzTmFtZTogJycsXG4gICAgICAgIGNyb3NzQnV0dG9uQ2xhc3NOYW1lOiAnJyxcbiAgICAgICAgY3Jvc3NDbGFzc05hbWU6ICcnLFxuICAgICAgICBpZDogJycsXG4gICAgICAgIGl0ZW1MaXN0Q2xhc3NOYW1lOiAnJyxcbiAgICAgICAgbWVudUNsYXNzTmFtZTogJycsXG4gICAgICAgIG1vcnBoU2hhcGVDbGFzc05hbWU6ICcnLFxuICAgICAgICBub092ZXJsYXk6IGZhbHNlLFxuICAgICAgICBvblN0YXRlQ2hhbmdlOiBmdW5jdGlvbiBvblN0YXRlQ2hhbmdlKCkge1xuICAgICAgICB9LFxuICAgICAgICBvdXRlckNvbnRhaW5lcklkOiAnJyxcbiAgICAgICAgb3ZlcmxheUNsYXNzTmFtZTogJycsXG4gICAgICAgIHBhZ2VXcmFwSWQ6ICcnLFxuICAgICAgICBzdHlsZXM6IHt9LFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgfTtcbiAgICByZXR1cm4gTWVudTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9zbmFwc3ZnSW1wb3J0ZXIgPSByZXF1aXJlKCcuLi9zbmFwc3ZnSW1wb3J0ZXInKTtcbnZhciBfc25hcHN2Z0ltcG9ydGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NuYXBzdmdJbXBvcnRlcik7XG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xudmFyIHN0eWxlcyA9IHtcbiAgICAgICAgc3ZnOiB7XG4gICAgICAgICAgICBsaWI6IF9zbmFwc3ZnSW1wb3J0ZXIyWydkZWZhdWx0J10sXG4gICAgICAgICAgICBwYXRoSW5pdGlhbDogJ00tNy4zMTIsMEgwYzAsMCwwLDExMy44MzksMCw0MDBjMCwyNjQuNTA2LDAsNDAwLDAsNDAwaC03LjMxMlYweicsXG4gICAgICAgICAgICBwYXRoT3BlbjogJ00tNy4zMTIsMEgxNWMwLDAsNjYsMTEzLjMzOSw2NiwzOTkuNUM4MSw2NjQuMDA2LDE1LDgwMCwxNSw4MDBILTcuMzEyVjB6O00tNy4zMTIsMEgxMDBjMCwwLDAsMTEzLjgzOSwwLDQwMGMwLDI2NC41MDYsMCw0MDAsMCw0MDBILTcuMzEyVjB6JyxcbiAgICAgICAgICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUocGF0aCkge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgICAgICAgICAgIHZhciBzdGVwcyA9IHRoaXMucGF0aE9wZW4uc3BsaXQoJzsnKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RlcHNUb3RhbCA9IHN0ZXBzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgbWluYSA9IHdpbmRvdy5taW5hO1xuICAgICAgICAgICAgICAgIHZhciBuZXh0U3RlcCA9IGZ1bmN0aW9uIG5leHRTdGVwKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID4gc3RlcHNUb3RhbCAtIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHBhdGguYW5pbWF0ZSh7IHBhdGg6IHN0ZXBzW3Bvc10gfSwgcG9zID09PSAwID8gNDAwIDogNTAwLCBwb3MgPT09IDAgPyBtaW5hLmVhc2VpbiA6IG1pbmEuZWxhc3RpYywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0ZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbmV4dFN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9ycGhTaGFwZTogZnVuY3Rpb24gbW9ycGhTaGFwZShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodCA/ICdpbmhlcml0JyA6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJ3JvdGF0ZVkoMGRlZyknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICdyb3RhdGVZKDBkZWcpJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJpZ2h0ID8gJ3JvdGF0ZVkoMTgwZGVnKScgOiAncm90YXRlWSgwZGVnKSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLFxuICAgICAgICAgICAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAndHJhbnNmb3JtIDAuNHMgMHMnIDogJ3RyYW5zZm9ybSAwLjRzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVudTogZnVuY3Rpb24gbWVudShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgd2lkdGggLT0gMTQwO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdvcGFjaXR5IDAuMXMgMC40cyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDAuMXMgMC40cyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScgOiAnb3BhY2l0eSAwcyAwLjNzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpLCB0cmFuc2Zvcm0gMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGl0ZW06IGZ1bmN0aW9uIGl0ZW0oaXNPcGVuLCB3aWR0aCwgcmlnaHQsIG50aENoaWxkKSB7XG4gICAgICAgICAgICB3aWR0aCAtPSAxNDA7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICdvcGFjaXR5IDAuM3MgMC40cywgdHJhbnNmb3JtIDAuM3MgMC40cycgOiAnb3BhY2l0eSAwcyAwLjNzIGN1YmljLWJlemllciguMTcsIC42NywgLjEsIDEuMjcpLCB0cmFuc2Zvcm0gMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogaXNPcGVuID8gMSA6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlQnV0dG9uOiBmdW5jdGlvbiBjbG9zZUJ1dHRvbihpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgd2lkdGggLT0gMTQwO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBpc09wZW4gPyAnb3BhY2l0eSAwLjNzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyksIHRyYW5zZm9ybSAwLjNzIDAuNHMgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknIDogJ29wYWNpdHkgMHMgMC4zcyBjdWJpYy1iZXppZXIoLjE3LCAuNjcsIC4xLCAxLjI3KSwgdHJhbnNmb3JtIDBzIDAuM3MgY3ViaWMtYmV6aWVyKC4xNywgLjY3LCAuMSwgMS4yNyknLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGlzT3BlbiA/IDEgOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9zbmFwc3ZnSW1wb3J0ZXIgPSByZXF1aXJlKCcuLi9zbmFwc3ZnSW1wb3J0ZXInKTtcbnZhciBfc25hcHN2Z0ltcG9ydGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NuYXBzdmdJbXBvcnRlcik7XG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xudmFyIHN0eWxlcyA9IHtcbiAgICAgICAgc3ZnOiB7XG4gICAgICAgICAgICBsaWI6IF9zbmFwc3ZnSW1wb3J0ZXIyWydkZWZhdWx0J10sXG4gICAgICAgICAgICBwYXRoSW5pdGlhbDogJ00tMSwwaDEwMWMwLDAtOTcuODMzLDE1My42MDMtOTcuODMzLDM5Ni4xNjdDMi4xNjcsNjI3LjU3OSwxMDAsODAwLDEwMCw4MDBILTFWMHonLFxuICAgICAgICAgICAgcGF0aE9wZW46ICdNLTEsMGgxMDFjMCwwLDAtMSwwLDM5NWMwLDQwNCwwLDQwNSwwLDQwNUgtMVYweicsXG4gICAgICAgICAgICBhbmltYXRlOiBmdW5jdGlvbiBhbmltYXRlKHBhdGgpIHtcbiAgICAgICAgICAgICAgICBwYXRoLmFuaW1hdGUoeyBwYXRoOiB0aGlzLnBhdGhPcGVuIH0sIDQwMCwgd2luZG93Lm1pbmEuZWFzZWlub3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9ycGhTaGFwZTogZnVuY3Rpb24gbW9ycGhTaGFwZShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodCA/ICdpbmhlcml0JyA6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnLFxuICAgICAgICAgICAgICAgIE1zVHJhbnNmb3JtOiByaWdodCA/ICdyb3RhdGVZKDE4MGRlZyknIDogJycsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcmlnaHQgPyAncm90YXRlWSgxODBkZWcpJyA6ICcnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAndHJhbnNsYXRlM2QoMCwgMCwgMCknIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbWVudTogZnVuY3Rpb24gbWVudShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgICByaWdodDogcmlnaHQgPyAwIDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxODAsXG4gICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXG4gICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbUxpc3Q6IGZ1bmN0aW9uIGl0ZW1MaXN0KGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgICAgICAgICBpZiAocmlnaHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJy0xMTBweCcsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTcwJScsXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnYXV0bydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAwKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogaXNPcGVuID8gJ2FsbCAwLjNzJyA6ICdhbGwgMC4zcyAwLjFzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0ZXJDb250YWluZXI6IGZ1bmN0aW9uIG91dGVyQ29udGFpbmVyKGlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuIHsgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbicgfTtcbiAgICAgICAgfVxuICAgIH07XG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTtcbn1cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG52YXIgc3R5bGVzID0ge1xuICAgICAgICBtZW51V3JhcDogZnVuY3Rpb24gbWVudVdyYXAoaXNPcGVuKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAtMTAwJSwgMCknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgLTEwMCUsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIC0xMDAlLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzIGVhc2UtaW4tb3V0J1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgb3V0ZXJDb250YWluZXI6IGZ1bmN0aW9uIG91dGVyQ29udGFpbmVyKGlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTogJzE1MDBweCcsXG4gICAgICAgICAgICAgICAgcGVyc3BlY3RpdmVPcmlnaW46ICcwJSA1MCUnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcbnZhciBzdHlsZXMgPSB7XG4gICAgICAgIHBhZ2VXcmFwOiBmdW5jdGlvbiBwYWdlV3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB7IG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nIH07XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07XG59XG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xudmFyIHN0eWxlcyA9IHtcbiAgICAgICAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgxNWRlZyknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoLTE1ZGVnKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgICAgICAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoMTVkZWcpJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKC0xNWRlZyknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgxNWRlZyknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApIHJvdGF0ZVkoLTE1ZGVnKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKSByb3RhdGVZKDE1ZGVnKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCkgcm90YXRlWSgtMTVkZWcpJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHJpZ2h0ID8gJzEwMCUgNTAlJyA6ICcwJSA1MCUnLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6ICcxNTAwcHgnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcbnZhciBzdHlsZXMgPSB7XG4gICAgICAgIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBpc09wZW4gPyAndmlzaWJsZScgOiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgb3ZlcmxheTogZnVuY3Rpb24gb3ZlcmxheShpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJyxcbiAgICAgICAgICAgICAgICB2aXNpYmlsaXR5OiBpc09wZW4gPyAndmlzaWJsZScgOiAnaGlkZGVuJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgsIHJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIE1velRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjVzJyxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGJ1cmdlckljb246IGZ1bmN0aW9uIGJ1cmdlckljb24oaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBPVHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjFzJyxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB7IG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nIH07XG4gICAgICAgIH1cbiAgICB9O1xuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9tZW51RmFjdG9yeTJbJ2RlZmF1bHQnXSkoc3R5bGVzKTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0Jztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07XG59XG52YXIgX21lbnVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vbWVudUZhY3RvcnknKTtcbnZhciBfbWVudUZhY3RvcnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWVudUZhY3RvcnkpO1xudmFyIHN0eWxlcyA9IHtcbiAgICAgICAgcGFnZVdyYXA6IGZ1bmN0aW9uIHBhZ2VXcmFwKGlzT3Blbiwgd2lkdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAtJyArIHdpZHRoICsgJyknLFxuICAgICAgICAgICAgICAgIE1zVHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAtJyArIHdpZHRoICsgJyknLFxuICAgICAgICAgICAgICAgIE9UcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsIDAsIC0nICsgd2lkdGggKyAnKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAwLCAtJyArIHdpZHRoICsgJyknLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgMCwgLScgKyB3aWR0aCArICcpJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuNXMnXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBvdXRlckNvbnRhaW5lcjogZnVuY3Rpb24gb3V0ZXJDb250YWluZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBwZXJzcGVjdGl2ZTogJzE1MDBweCcgfTtcbiAgICAgICAgfVxuICAgIH07XG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTtcbn1cbnZhciBfbWVudUZhY3RvcnkgPSByZXF1aXJlKCcuLi9tZW51RmFjdG9yeScpO1xudmFyIF9tZW51RmFjdG9yeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tZW51RmFjdG9yeSk7XG52YXIgc3R5bGVzID0ge1xuICAgICAgICBwYWdlV3JhcDogZnVuY3Rpb24gcGFnZVdyYXAoaXNPcGVuLCB3aWR0aCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKDIwZGVnKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgtMjBkZWcpJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgtMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgyMGRlZyknIDogJ3RyYW5zbGF0ZTNkKDEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoLTIwZGVnKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKC0xMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKDIwZGVnKScgOiAndHJhbnNsYXRlM2QoMTAwcHgsIDAsIC02MDBweCkgcm90YXRlWSgtMjBkZWcpJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoLTEwMHB4LCAwLCAtNjAwcHgpIHJvdGF0ZVkoMjBkZWcpJyA6ICd0cmFuc2xhdGUzZCgxMDBweCwgMCwgLTYwMHB4KSByb3RhdGVZKC0yMGRlZyknLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0eWxlOiAncHJlc2VydmUtM2QnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC41cycsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGlzT3BlbiA/ICcnIDogJ2hpZGRlbidcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIG91dGVyQ29udGFpbmVyOiBmdW5jdGlvbiBvdXRlckNvbnRhaW5lcihpc09wZW4pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU6ICcxNTAwcHgnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBpc09wZW4gPyAnJyA6ICdoaWRkZW4nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcbnZhciBzdHlsZXMgPSB7fTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfbWVudUZhY3RvcnkyWydkZWZhdWx0J10pKHN0eWxlcyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9O1xufVxudmFyIF9tZW51RmFjdG9yeSA9IHJlcXVpcmUoJy4uL21lbnVGYWN0b3J5Jyk7XG52YXIgX21lbnVGYWN0b3J5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21lbnVGYWN0b3J5KTtcbnZhciBzdHlsZXMgPSB7XG4gICAgICAgIG1lbnVXcmFwOiBmdW5jdGlvbiBtZW51V3JhcChpc09wZW4sIHdpZHRoLCByaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBNb3pUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgTXNUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiByaWdodCA/ICd0cmFuc2xhdGUzZCgnICsgd2lkdGggKyAnLCAwLCAwKScgOiAndHJhbnNsYXRlM2QoLScgKyB3aWR0aCArICcsIDAsIDApJyxcbiAgICAgICAgICAgICAgICBXZWJraXRUcmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogcmlnaHQgPyAndHJhbnNsYXRlM2QoJyArIHdpZHRoICsgJywgMCwgMCknIDogJ3RyYW5zbGF0ZTNkKC0nICsgd2lkdGggKyAnLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6IHJpZ2h0ID8gJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aCArICcsIDAsIDApJyA6ICd0cmFuc2xhdGUzZCgtJyArIHdpZHRoICsgJywgMCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICd0cmFuc2Zvcm0gMC44cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJyA6ICd0cmFuc2Zvcm0gMC40cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgaXRlbTogZnVuY3Rpb24gaXRlbShpc09wZW4sIHdpZHRoLCByaWdodCwgbnRoQ2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgTW96VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgICAgICAgICAgICBNc1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgJyArIG50aENoaWxkICogNTAwICsgJ3B4LCAwKScsXG4gICAgICAgICAgICAgICAgT1RyYW5zZm9ybTogaXNPcGVuID8gJycgOiAndHJhbnNsYXRlM2QoMCwgJyArIG50aENoaWxkICogNTAwICsgJ3B4LCAwKScsXG4gICAgICAgICAgICAgICAgV2Via2l0VHJhbnNmb3JtOiBpc09wZW4gPyAnJyA6ICd0cmFuc2xhdGUzZCgwLCAnICsgbnRoQ2hpbGQgKiA1MDAgKyAncHgsIDApJyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGlzT3BlbiA/ICcnIDogJ3RyYW5zbGF0ZTNkKDAsICcgKyBudGhDaGlsZCAqIDUwMCArICdweCwgMCknLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGlzT3BlbiA/ICd0cmFuc2Zvcm0gMC44cyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJyA6ICd0cmFuc2Zvcm0gMHMgMC4ycyBjdWJpYy1iZXppZXIoMC43LCAwLCAwLjMsIDEpJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5leHBvcnRzWydkZWZhdWx0J10gPSAoMCwgX21lbnVGYWN0b3J5MlsnZGVmYXVsdCddKShzdHlsZXMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgU25hcCA9IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgICBTbmFwID0gcmVxdWlyZSgnc25hcHN2Zy1janMnKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICByZXR1cm4gU25hcDtcbiAgICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcbiAgICBzbGlkZTogcmVxdWlyZSgnLi9tZW51cy9zbGlkZScpLFxuICAgIHN0YWNrOiByZXF1aXJlKCcuL21lbnVzL3N0YWNrJyksXG4gICAgZWxhc3RpYzogcmVxdWlyZSgnLi9tZW51cy9lbGFzdGljJyksXG4gICAgYnViYmxlOiByZXF1aXJlKCcuL21lbnVzL2J1YmJsZScpLFxuICAgIHB1c2g6IHJlcXVpcmUoJy4vbWVudXMvcHVzaCcpLFxuICAgIHB1c2hSb3RhdGU6IHJlcXVpcmUoJy4vbWVudXMvcHVzaFJvdGF0ZScpLFxuICAgIHNjYWxlRG93bjogcmVxdWlyZSgnLi9tZW51cy9zY2FsZURvd24nKSxcbiAgICBzY2FsZVJvdGF0ZTogcmVxdWlyZSgnLi9tZW51cy9zY2FsZVJvdGF0ZScpLFxuICAgIGZhbGxEb3duOiByZXF1aXJlKCcuL21lbnVzL2ZhbGxEb3duJyksXG4gICAgcmV2ZWFsOiByZXF1aXJlKCcuL21lbnVzL3JldmVhbCcpXG59O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107Il19
