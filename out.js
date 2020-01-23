(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],6:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":4,"./encode":5}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":8,"punycode":3,"querystring":6}],8:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],9:[function(require,module,exports){
window.a = require(".")

},{".":10}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="web-bluetooth"/>
const cross_bluetooth_1 = __importDefault(require("cross-bluetooth"));
const ow_1 = __importDefault(require("ow"));
async function request(options = {}) {
    ow_1.default(options, ow_1.default.optional.object.exactShape({
        name: ow_1.default.optional.string,
        namePrefix: ow_1.default.optional.string,
        services: ow_1.default.optional.array,
        optionalServices: ow_1.default.optional.array
    }));
    if (!await isReady())
        throw Error("Not ready to connect to a device.");
    const { id, name, gatt } = await cross_bluetooth_1.default.requestDevice((options.name || options.namePrefix || options.services) ? {
        filters: [{ services: options.services, name: options.name, namePrefix: options.namePrefix }],
        optionalServices: options.optionalServices
    } : {
        acceptAllDevices: true,
        optionalServices: options.optionalServices
    });
    return {
        id,
        name,
        gatt: await gatt.connect(),
        services: await gatt.getPrimaryServices(),
        disconnect: gatt.disconnect,
    };
}
exports.request = request;
async function isReady() {
    return await cross_bluetooth_1.default.getAvailability();
}
exports.isReady = isReady;

},{"cross-bluetooth":11,"ow":12}],11:[function(require,module,exports){
"use strict"

module.exports = navigator.bluetooth

},{}],12:[function(require,module,exports){
(function (process,global){
module.exports=function(e){var t={};function r(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=4)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(8),i=r(16),o=r(2);t.validatorSymbol=Symbol("validators");t.Predicate=class{constructor(e,t={}){this.type=e,this.options=t,this.context={validators:[]},this.context=Object.assign(Object.assign({},this.context),this.options);const r=this.type[0].toLowerCase()+this.type.slice(1);this.addValidator({message:(e,t)=>{var r;return`Expected ${(null===(r=t)||void 0===r?void 0:r.slice(this.type.length+1))||"argument"} to be of type \`${this.type}\` but received type \`${a.default(e)}\``},validator:e=>a.default[r](e)})}[o.testSymbol](e,t,r){for(const{validator:a,message:i}of this.context.validators){if(!0===this.options.optional&&void 0===e)continue;const o=a(e);if(!0===o)continue;let s=r;throw"function"==typeof r&&(s=r()),s=s?`${this.type} \`${s}\``:this.type,new n.ArgumentError(i(e,s,o),t)}}get[t.validatorSymbol](){return this.context.validators}get not(){return i.not(this)}validate(e){return this.addValidator({message:(e,t,r)=>"string"==typeof r?`(${t}) ${r}`:r(t),validator:t=>{const{message:r,validator:a}=e(t);return!!a||r}})}is(e){return this.addValidator({message:(e,t,r)=>r?`(${t}) ${r}`:`Expected ${t} \`${e}\` to pass custom validation function`,validator:e})}addValidator(e){return this.context.validators.push(e),this}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a="undefined"==typeof URL?r(15).URL:URL,{toString:n}=Object.prototype,i=e=>t=>typeof t===e,o=e=>{const t=n.call(e).slice(8,-1);if(t)return t},s=e=>t=>o(t)===e;function d(e){switch(e){case null:return"null";case!0:case!1:return"boolean"}switch(typeof e){case"undefined":return"undefined";case"string":return"string";case"number":return"number";case"bigint":return"bigint";case"symbol":return"symbol"}if(d.function_(e))return"Function";if(d.observable(e))return"Observable";if(d.array(e))return"Array";if(d.buffer(e))return"Buffer";const t=o(e);if(t)return t;if(e instanceof String||e instanceof Boolean||e instanceof Number)throw new TypeError("Please don't use object wrappers for primitive types");return"Object"}d.undefined=i("undefined"),d.string=i("string");const c=i("number");d.number=e=>c(e)&&!d.nan(e),d.bigint=i("bigint"),d.function_=i("function"),d.null_=e=>null===e,d.class_=e=>d.function_(e)&&e.toString().startsWith("class "),d.boolean=e=>!0===e||!1===e,d.symbol=i("symbol"),d.numericString=e=>d.string(e)&&e.length>0&&!Number.isNaN(Number(e)),d.array=Array.isArray,d.buffer=e=>!d.nullOrUndefined(e)&&!d.nullOrUndefined(e.constructor)&&d.function_(e.constructor.isBuffer)&&e.constructor.isBuffer(e),d.nullOrUndefined=e=>d.null_(e)||d.undefined(e),d.object=e=>!d.null_(e)&&("object"==typeof e||d.function_(e)),d.iterable=e=>!d.nullOrUndefined(e)&&d.function_(e[Symbol.iterator]),d.asyncIterable=e=>!d.nullOrUndefined(e)&&d.function_(e[Symbol.asyncIterator]),d.generator=e=>d.iterable(e)&&d.function_(e.next)&&d.function_(e.throw),d.nativePromise=e=>s("Promise")(e);d.promise=e=>d.nativePromise(e)||(e=>d.object(e)&&d.function_(e.then)&&d.function_(e.catch))(e),d.generatorFunction=s("GeneratorFunction"),d.asyncFunction=s("AsyncFunction"),d.boundFunction=e=>d.function_(e)&&!e.hasOwnProperty("prototype"),d.regExp=s("RegExp"),d.date=s("Date"),d.error=s("Error"),d.map=e=>s("Map")(e),d.set=e=>s("Set")(e),d.weakMap=e=>s("WeakMap")(e),d.weakSet=e=>s("WeakSet")(e),d.int8Array=s("Int8Array"),d.uint8Array=s("Uint8Array"),d.uint8ClampedArray=s("Uint8ClampedArray"),d.int16Array=s("Int16Array"),d.uint16Array=s("Uint16Array"),d.int32Array=s("Int32Array"),d.uint32Array=s("Uint32Array"),d.float32Array=s("Float32Array"),d.float64Array=s("Float64Array"),d.bigInt64Array=s("BigInt64Array"),d.bigUint64Array=s("BigUint64Array"),d.arrayBuffer=s("ArrayBuffer"),d.sharedArrayBuffer=s("SharedArrayBuffer"),d.dataView=s("DataView"),d.directInstanceOf=(e,t)=>Object.getPrototypeOf(e)===t.prototype,d.urlInstance=e=>s("URL")(e),d.urlString=e=>{if(!d.string(e))return!1;try{return new a(e),!0}catch(e){return!1}},d.truthy=e=>Boolean(e),d.falsy=e=>!e,d.nan=e=>Number.isNaN(e);const u=new Set(["undefined","string","number","bigint","boolean","symbol"]);d.primitive=e=>d.null_(e)||u.has(typeof e),d.integer=e=>Number.isInteger(e),d.safeInteger=e=>Number.isSafeInteger(e),d.plainObject=e=>{if("Object"!==o(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.getPrototypeOf({})};const l=new Set(["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array"]);d.typedArray=e=>{const t=o(e);return void 0!==t&&l.has(t)};d.arrayLike=e=>!d.nullOrUndefined(e)&&!d.function_(e)&&(e=>d.safeInteger(e)&&e>=0)(e.length),d.inRange=(e,t)=>{if(d.number(t))return e>=Math.min(0,t)&&e<=Math.max(t,0);if(d.array(t)&&2===t.length)return e>=Math.min(...t)&&e<=Math.max(...t);throw new TypeError(`Invalid range: ${JSON.stringify(t)}`)};const f=["innerHTML","ownerDocument","style","attributes","nodeValue"];d.domElement=e=>d.object(e)&&1===e.nodeType&&d.string(e.nodeName)&&!d.plainObject(e)&&f.every(t=>t in e),d.observable=e=>!!e&&(!(!e[Symbol.observable]||e!==e[Symbol.observable]())||!(!e["@@observable"]||e!==e["@@observable"]())),d.nodeStream=e=>d.object(e)&&d.function_(e.pipe)&&!d.observable(e),d.infinite=e=>e===1/0||e===-1/0;const g=e=>t=>d.integer(t)&&Math.abs(t%2)===e;d.evenInteger=g(0),d.oddInteger=g(1),d.emptyArray=e=>d.array(e)&&0===e.length,d.nonEmptyArray=e=>d.array(e)&&e.length>0,d.emptyString=e=>d.string(e)&&0===e.length,d.nonEmptyString=e=>d.string(e)&&e.length>0;d.emptyStringOrWhitespace=e=>d.emptyString(e)||(e=>d.string(e)&&!1===/\S/.test(e))(e),d.emptyObject=e=>d.object(e)&&!d.map(e)&&!d.set(e)&&0===Object.keys(e).length,d.nonEmptyObject=e=>d.object(e)&&!d.map(e)&&!d.set(e)&&Object.keys(e).length>0,d.emptySet=e=>d.set(e)&&0===e.size,d.nonEmptySet=e=>d.set(e)&&e.size>0,d.emptyMap=e=>d.map(e)&&0===e.size,d.nonEmptyMap=e=>d.map(e)&&e.size>0;const p=(e,t,r)=>{if(!1===d.function_(t))throw new TypeError(`Invalid predicate: ${JSON.stringify(t)}`);if(0===r.length)throw new TypeError("Invalid number of values");return e.call(r,t)};d.any=(e,...t)=>p(Array.prototype.some,e,t),d.all=(e,...t)=>p(Array.prototype.every,e,t),Object.defineProperties(d,{class:{value:d.class_},function:{value:d.function_},null:{value:d.null_}}),t.default=d,e.exports=d,e.exports.default=d},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.testSymbol=Symbol("test"),t.isPredicate=e=>Boolean(e[t.testSymbol])},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=(e,t,r=5)=>{const a=[];for(const n of t)if(!e.has(n)&&(a.push(n),a.length===r))return a;return 0===a.length||a}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(10),n=r(11),i=r(0);t.Predicate=i.Predicate;const o=r(2),s=r(18),d=r(6),c=r(9),u=(e,t,r)=>{if(!o.isPredicate(t)&&"string"!=typeof t)throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof t}\``);if(o.isPredicate(t)){const r=a.default();c.default(e,()=>n.inferLabel(r),t)}else c.default(e,t,r)};Object.defineProperties(u,{isValid:{value:(e,t)=>{try{return u(e,t),!0}catch(e){return!1}}},create:{value:(e,t)=>r=>{if(o.isPredicate(e)){const t=a.default();c.default(r,()=>n.inferLabel(t),e)}else c.default(r,e,t)}}}),t.default=d.default(s.default(u));var l=r(6);t.StringPredicate=l.StringPredicate,t.NumberPredicate=l.NumberPredicate,t.BooleanPredicate=l.BooleanPredicate,t.ArrayPredicate=l.ArrayPredicate,t.ObjectPredicate=l.ObjectPredicate,t.DatePredicate=l.DatePredicate,t.ErrorPredicate=l.ErrorPredicate,t.MapPredicate=l.MapPredicate,t.WeakMapPredicate=l.WeakMapPredicate,t.SetPredicate=l.SetPredicate,t.WeakSetPredicate=l.WeakSetPredicate,t.AnyPredicate=l.AnyPredicate},function(e,t,r){(function(e){var r=200,a="__lodash_hash_undefined__",n=1,i=2,o=9007199254740991,s="[object Arguments]",d="[object Array]",c="[object AsyncFunction]",u="[object Boolean]",l="[object Date]",f="[object Error]",g="[object Function]",p="[object GeneratorFunction]",y="[object Map]",h="[object Number]",m="[object Null]",v="[object Object]",b="[object Proxy]",$="[object RegExp]",_="[object Set]",P="[object String]",O="[object Symbol]",x="[object Undefined]",E="[object ArrayBuffer]",j="[object DataView]",S=/^\[object .+?Constructor\]$/,w=/^(?:0|[1-9]\d*)$/,A={};A["[object Float32Array]"]=A["[object Float64Array]"]=A["[object Int8Array]"]=A["[object Int16Array]"]=A["[object Int32Array]"]=A["[object Uint8Array]"]=A["[object Uint8ClampedArray]"]=A["[object Uint16Array]"]=A["[object Uint32Array]"]=!0,A[s]=A[d]=A[E]=A[u]=A[j]=A[l]=A[f]=A[g]=A[y]=A[h]=A[v]=A[$]=A[_]=A[P]=A["[object WeakMap]"]=!1;var V="object"==typeof global&&global&&global.Object===Object&&global,M="object"==typeof self&&self&&self.Object===Object&&self,z=V||M||Function("return this")(),N=t&&!t.nodeType&&t,k=N&&"object"==typeof e&&e&&!e.nodeType&&e,I=k&&k.exports===N,U=I&&V.process,J=function(){try{return U&&U.binding&&U.binding("util")}catch(e){}}(),T=J&&J.isTypedArray;function B(e,t){for(var r=-1,a=null==e?0:e.length;++r<a;)if(t(e[r],r,e))return!0;return!1}function W(e){var t=-1,r=Array(e.size);return e.forEach((function(e,a){r[++t]=[a,e]})),r}function F(e){var t=-1,r=Array(e.size);return e.forEach((function(e){r[++t]=e})),r}var L,R,q,D=Array.prototype,C=Function.prototype,K=Object.prototype,G=z["__core-js_shared__"],H=C.toString,Q=K.hasOwnProperty,X=(L=/[^.]+$/.exec(G&&G.keys&&G.keys.IE_PROTO||""))?"Symbol(src)_1."+L:"",Y=K.toString,Z=RegExp("^"+H.call(Q).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),ee=I?z.Buffer:void 0,te=z.Symbol,re=z.Uint8Array,ae=K.propertyIsEnumerable,ne=D.splice,ie=te?te.toStringTag:void 0,oe=Object.getOwnPropertySymbols,se=ee?ee.isBuffer:void 0,de=(R=Object.keys,q=Object,function(e){return R(q(e))}),ce=Je(z,"DataView"),ue=Je(z,"Map"),le=Je(z,"Promise"),fe=Je(z,"Set"),ge=Je(z,"WeakMap"),pe=Je(Object,"create"),ye=Fe(ce),he=Fe(ue),me=Fe(le),ve=Fe(fe),be=Fe(ge),$e=te?te.prototype:void 0,_e=$e?$e.valueOf:void 0;function Pe(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function Oe(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function xe(e){var t=-1,r=null==e?0:e.length;for(this.clear();++t<r;){var a=e[t];this.set(a[0],a[1])}}function Ee(e){var t=-1,r=null==e?0:e.length;for(this.__data__=new xe;++t<r;)this.add(e[t])}function je(e){var t=this.__data__=new Oe(e);this.size=t.size}function Se(e,t){var r=qe(e),a=!r&&Re(e),n=!r&&!a&&De(e),i=!r&&!a&&!n&&Qe(e),o=r||a||n||i,s=o?function(e,t){for(var r=-1,a=Array(e);++r<e;)a[r]=t(r);return a}(e.length,String):[],d=s.length;for(var c in e)!t&&!Q.call(e,c)||o&&("length"==c||n&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||We(c,d))||s.push(c);return s}function we(e,t){for(var r=e.length;r--;)if(Le(e[r][0],t))return r;return-1}function Ae(e){return null==e?void 0===e?x:m:ie&&ie in Object(e)?function(e){var t=Q.call(e,ie),r=e[ie];try{e[ie]=void 0;var a=!0}catch(e){}var n=Y.call(e);a&&(t?e[ie]=r:delete e[ie]);return n}(e):function(e){return Y.call(e)}(e)}function Ve(e){return He(e)&&Ae(e)==s}function Me(e,t,r,a,o){return e===t||(null==e||null==t||!He(e)&&!He(t)?e!=e&&t!=t:function(e,t,r,a,o,c){var g=qe(e),p=qe(t),m=g?d:Be(e),b=p?d:Be(t),x=(m=m==s?v:m)==v,S=(b=b==s?v:b)==v,w=m==b;if(w&&De(e)){if(!De(t))return!1;g=!0,x=!1}if(w&&!x)return c||(c=new je),g||Qe(e)?ke(e,t,r,a,o,c):function(e,t,r,a,o,s,d){switch(r){case j:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case E:return!(e.byteLength!=t.byteLength||!s(new re(e),new re(t)));case u:case l:case h:return Le(+e,+t);case f:return e.name==t.name&&e.message==t.message;case $:case P:return e==t+"";case y:var c=W;case _:var g=a&n;if(c||(c=F),e.size!=t.size&&!g)return!1;var p=d.get(e);if(p)return p==t;a|=i,d.set(e,t);var m=ke(c(e),c(t),a,o,s,d);return d.delete(e),m;case O:if(_e)return _e.call(e)==_e.call(t)}return!1}(e,t,m,r,a,o,c);if(!(r&n)){var A=x&&Q.call(e,"__wrapped__"),V=S&&Q.call(t,"__wrapped__");if(A||V){var M=A?e.value():e,z=V?t.value():t;return c||(c=new je),o(M,z,r,a,c)}}if(!w)return!1;return c||(c=new je),function(e,t,r,a,i,o){var s=r&n,d=Ie(e),c=d.length,u=Ie(t).length;if(c!=u&&!s)return!1;var l=c;for(;l--;){var f=d[l];if(!(s?f in t:Q.call(t,f)))return!1}var g=o.get(e);if(g&&o.get(t))return g==t;var p=!0;o.set(e,t),o.set(t,e);var y=s;for(;++l<c;){f=d[l];var h=e[f],m=t[f];if(a)var v=s?a(m,h,f,t,e,o):a(h,m,f,e,t,o);if(!(void 0===v?h===m||i(h,m,r,a,o):v)){p=!1;break}y||(y="constructor"==f)}if(p&&!y){var b=e.constructor,$=t.constructor;b!=$&&"constructor"in e&&"constructor"in t&&!("function"==typeof b&&b instanceof b&&"function"==typeof $&&$ instanceof $)&&(p=!1)}return o.delete(e),o.delete(t),p}(e,t,r,a,o,c)}(e,t,r,a,Me,o))}function ze(e){return!(!Ge(e)||function(e){return!!X&&X in e}(e))&&(Ce(e)?Z:S).test(Fe(e))}function Ne(e){if(r=(t=e)&&t.constructor,a="function"==typeof r&&r.prototype||K,t!==a)return de(e);var t,r,a,n=[];for(var i in Object(e))Q.call(e,i)&&"constructor"!=i&&n.push(i);return n}function ke(e,t,r,a,o,s){var d=r&n,c=e.length,u=t.length;if(c!=u&&!(d&&u>c))return!1;var l=s.get(e);if(l&&s.get(t))return l==t;var f=-1,g=!0,p=r&i?new Ee:void 0;for(s.set(e,t),s.set(t,e);++f<c;){var y=e[f],h=t[f];if(a)var m=d?a(h,y,f,t,e,s):a(y,h,f,e,t,s);if(void 0!==m){if(m)continue;g=!1;break}if(p){if(!B(t,(function(e,t){if(n=t,!p.has(n)&&(y===e||o(y,e,r,a,s)))return p.push(t);var n}))){g=!1;break}}else if(y!==h&&!o(y,h,r,a,s)){g=!1;break}}return s.delete(e),s.delete(t),g}function Ie(e){return function(e,t,r){var a=t(e);return qe(e)?a:function(e,t){for(var r=-1,a=t.length,n=e.length;++r<a;)e[n+r]=t[r];return e}(a,r(e))}(e,Xe,Te)}function Ue(e,t){var r,a,n=e.__data__;return("string"==(a=typeof(r=t))||"number"==a||"symbol"==a||"boolean"==a?"__proto__"!==r:null===r)?n["string"==typeof t?"string":"hash"]:n.map}function Je(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return ze(r)?r:void 0}Pe.prototype.clear=function(){this.__data__=pe?pe(null):{},this.size=0},Pe.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},Pe.prototype.get=function(e){var t=this.__data__;if(pe){var r=t[e];return r===a?void 0:r}return Q.call(t,e)?t[e]:void 0},Pe.prototype.has=function(e){var t=this.__data__;return pe?void 0!==t[e]:Q.call(t,e)},Pe.prototype.set=function(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=pe&&void 0===t?a:t,this},Oe.prototype.clear=function(){this.__data__=[],this.size=0},Oe.prototype.delete=function(e){var t=this.__data__,r=we(t,e);return!(r<0)&&(r==t.length-1?t.pop():ne.call(t,r,1),--this.size,!0)},Oe.prototype.get=function(e){var t=this.__data__,r=we(t,e);return r<0?void 0:t[r][1]},Oe.prototype.has=function(e){return we(this.__data__,e)>-1},Oe.prototype.set=function(e,t){var r=this.__data__,a=we(r,e);return a<0?(++this.size,r.push([e,t])):r[a][1]=t,this},xe.prototype.clear=function(){this.size=0,this.__data__={hash:new Pe,map:new(ue||Oe),string:new Pe}},xe.prototype.delete=function(e){var t=Ue(this,e).delete(e);return this.size-=t?1:0,t},xe.prototype.get=function(e){return Ue(this,e).get(e)},xe.prototype.has=function(e){return Ue(this,e).has(e)},xe.prototype.set=function(e,t){var r=Ue(this,e),a=r.size;return r.set(e,t),this.size+=r.size==a?0:1,this},Ee.prototype.add=Ee.prototype.push=function(e){return this.__data__.set(e,a),this},Ee.prototype.has=function(e){return this.__data__.has(e)},je.prototype.clear=function(){this.__data__=new Oe,this.size=0},je.prototype.delete=function(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r},je.prototype.get=function(e){return this.__data__.get(e)},je.prototype.has=function(e){return this.__data__.has(e)},je.prototype.set=function(e,t){var a=this.__data__;if(a instanceof Oe){var n=a.__data__;if(!ue||n.length<r-1)return n.push([e,t]),this.size=++a.size,this;a=this.__data__=new xe(n)}return a.set(e,t),this.size=a.size,this};var Te=oe?function(e){return null==e?[]:(e=Object(e),function(e,t){for(var r=-1,a=null==e?0:e.length,n=0,i=[];++r<a;){var o=e[r];t(o,r,e)&&(i[n++]=o)}return i}(oe(e),(function(t){return ae.call(e,t)})))}:function(){return[]},Be=Ae;function We(e,t){return!!(t=null==t?o:t)&&("number"==typeof e||w.test(e))&&e>-1&&e%1==0&&e<t}function Fe(e){if(null!=e){try{return H.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function Le(e,t){return e===t||e!=e&&t!=t}(ce&&Be(new ce(new ArrayBuffer(1)))!=j||ue&&Be(new ue)!=y||le&&"[object Promise]"!=Be(le.resolve())||fe&&Be(new fe)!=_||ge&&"[object WeakMap]"!=Be(new ge))&&(Be=function(e){var t=Ae(e),r=t==v?e.constructor:void 0,a=r?Fe(r):"";if(a)switch(a){case ye:return j;case he:return y;case me:return"[object Promise]";case ve:return _;case be:return"[object WeakMap]"}return t});var Re=Ve(function(){return arguments}())?Ve:function(e){return He(e)&&Q.call(e,"callee")&&!ae.call(e,"callee")},qe=Array.isArray;var De=se||function(){return!1};function Ce(e){if(!Ge(e))return!1;var t=Ae(e);return t==g||t==p||t==c||t==b}function Ke(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=o}function Ge(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function He(e){return null!=e&&"object"==typeof e}var Qe=T?function(e){return function(t){return e(t)}}(T):function(e){return He(e)&&Ke(e.length)&&!!A[Ae(e)]};function Xe(e){return null!=(t=e)&&Ke(t.length)&&!Ce(t)?Se(e):Ne(e);var t}e.exports=function(e,t){return Me(e,t)}}).call(this,r(24)(e))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(19);t.StringPredicate=a.StringPredicate;const n=r(21);t.NumberPredicate=n.NumberPredicate;const i=r(22);t.BooleanPredicate=i.BooleanPredicate;const o=r(0),s=r(23);t.ArrayPredicate=s.ArrayPredicate;const d=r(25);t.ObjectPredicate=d.ObjectPredicate;const c=r(30);t.DatePredicate=c.DatePredicate;const u=r(31);t.ErrorPredicate=u.ErrorPredicate;const l=r(32);t.MapPredicate=l.MapPredicate;const f=r(33);t.WeakMapPredicate=f.WeakMapPredicate;const g=r(34);t.SetPredicate=g.SetPredicate;const p=r(35);t.WeakSetPredicate=p.WeakSetPredicate;const y=r(36);t.AnyPredicate=y.AnyPredicate,t.default=(e,t)=>(Object.defineProperties(e,{string:{get:()=>new a.StringPredicate(t)},number:{get:()=>new n.NumberPredicate(t)},boolean:{get:()=>new i.BooleanPredicate(t)},undefined:{get:()=>new o.Predicate("undefined",t)},null:{get:()=>new o.Predicate("null",t)},nullOrUndefined:{get:()=>new o.Predicate("nullOrUndefined",t)},nan:{get:()=>new o.Predicate("nan",t)},symbol:{get:()=>new o.Predicate("symbol",t)},array:{get:()=>new s.ArrayPredicate(t)},object:{get:()=>new d.ObjectPredicate(t)},date:{get:()=>new c.DatePredicate(t)},error:{get:()=>new u.ErrorPredicate(t)},map:{get:()=>new l.MapPredicate(t)},weakMap:{get:()=>new f.WeakMapPredicate(t)},set:{get:()=>new g.SetPredicate(t)},weakSet:{get:()=>new p.WeakSetPredicate(t)},function:{get:()=>new o.Predicate("Function",t)},buffer:{get:()=>new o.Predicate("Buffer",t)},regExp:{get:()=>new o.Predicate("RegExp",t)},promise:{get:()=>new o.Predicate("Promise",t)},typedArray:{get:()=>new o.Predicate("TypedArray",t)},int8Array:{get:()=>new o.Predicate("Int8Array",t)},uint8Array:{get:()=>new o.Predicate("Uint8Array",t)},uint8ClampedArray:{get:()=>new o.Predicate("Uint8ClampedArray",t)},int16Array:{get:()=>new o.Predicate("Int16Array",t)},uint16Array:{get:()=>new o.Predicate("Uint16Array",t)},int32Array:{get:()=>new o.Predicate("Int32Array",t)},uint32Array:{get:()=>new o.Predicate("Uint32Array",t)},float32Array:{get:()=>new o.Predicate("Float32Array",t)},float64Array:{get:()=>new o.Predicate("Float64Array",t)},arrayBuffer:{get:()=>new o.Predicate("ArrayBuffer",t)},dataView:{get:()=>new o.Predicate("DataView",t)},iterable:{get:()=>new o.Predicate("Iterable",t)},any:{value:(...e)=>new y.AnyPredicate(e,t)}}),e)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(4);t.default=(e,t)=>{try{for(const r of e)a.default(r,t);return!0}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class a extends Error{constructor(e,t){super(e),Error.captureStackTrace?Error.captureStackTrace(this,t):this.stack=(new Error).stack,this.name="ArgumentError"}}t.ArgumentError=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(2);t.default=function e(t,r,n){n[a.testSymbol](t,e,r)}},function(e,t,r){"use strict";const a=()=>{const e=Error.prepareStackTrace;Error.prepareStackTrace=(e,t)=>t;const t=(new Error).stack.slice(1);return Error.prepareStackTrace=e,t};e.exports=a,e.exports.default=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(12),n=r(13),i=r(14),o=/^.*?\((.*?)[,)]/;t.inferLabel=e=>{var t;if(!i.default)return;const r=e[1],s=r.getFileName(),d=r.getLineNumber(),c=r.getColumnNumber();if(null===s||null===d||null===c)return;let u=[];try{u=a.readFileSync(s,"utf8").split("\n")}catch(e){return}let l=u[d-1];if(!l)return;l=l.slice(c-1);const f=o.exec(l);if(!(null===(t=f)||void 0===t?void 0:t[1]))return;const g=f[1];return n.default(g)||n.default(g.split(".").pop())?g:void 0}},function(e,t){e.exports=require("fs")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=/^[a-z$_][a-z$_\d]*$/i,n=new Set(["undefined","null","true","false","super","this","Infinity","NaN"]);t.default=e=>e&&!n.has(e)&&a.test(e)},function(e,t,r){"use strict";var a,n;Object.defineProperty(t,"__esModule",{value:!0}),t.default=Boolean(null===(n=null===(a=process)||void 0===a?void 0:a.versions)||void 0===n?void 0:n.node)},function(e,t){e.exports=require("url")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(17),n=r(0);t.not=e=>{const t=e.addValidator;return e.addValidator=r=>{const{validator:i,message:o,negatedMessage:s}=r,d=a.default();return r.message=(e,t)=>s?s(e,t):o(e,d).replace(/ to /,"$&not ").replace(d,t),r.validator=e=>!i(e),e[n.validatorSymbol].push(r),e.addValidator=t,e},e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=()=>Math.random().toString(16).slice(2)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(6);t.default=e=>(Object.defineProperties(e,{optional:{get:()=>a.default({},{optional:!0})}}),e)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(20),i=r(0);class o extends i.Predicate{constructor(e){super("string",e)}length(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have length \`${e}\`, got \`${t}\``,validator:t=>t.length===e})}minLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum length of \`${e}\`, got \`${t}\``,validator:t=>t.length>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum length of \`${e-1}\`, got \`${t}\``})}maxLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum length of \`${e}\`, got \`${t}\``,validator:t=>t.length<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum length of \`${e+1}\`, got \`${t}\``})}matches(e){return this.addValidator({message:(t,r)=>`Expected ${r} to match \`${e}\`, got \`${t}\``,validator:t=>e.test(t)})}startsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to start with \`${e}\`, got \`${t}\``,validator:t=>t.startsWith(e)})}endsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to end with \`${e}\`, got \`${t}\``,validator:t=>t.endsWith(e)})}includes(e){return this.addValidator({message:(t,r)=>`Expected ${r} to include \`${e}\`, got \`${t}\``,validator:t=>t.includes(e)})}oneOf(e){return this.addValidator({message:(t,r)=>{let a=JSON.stringify(e);if(e.length>10){const t=e.length-10;a=JSON.stringify(e.slice(0,10)).replace(/]$/,`,…+${t} more]`)}return`Expected ${r} to be one of \`${a}\`, got \`${t}\``},validator:t=>e.includes(t)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${e}\``,validator:e=>""===e})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>""!==e})}equals(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be equal to \`${e}\`, got \`${t}\``,validator:t=>t===e})}get alphanumeric(){return this.addValidator({message:(e,t)=>`Expected ${t} to be alphanumeric, got \`${e}\``,validator:e=>/^[a-z\d]+$/i.test(e)})}get alphabetical(){return this.addValidator({message:(e,t)=>`Expected ${t} to be alphabetical, got \`${e}\``,validator:e=>/^[a-z]+$/gi.test(e)})}get numeric(){return this.addValidator({message:(e,t)=>`Expected ${t} to be numeric, got \`${e}\``,validator:e=>/^(\+|-)?\d+$/i.test(e)})}get date(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a date, got \`${e}\``,validator:n})}get lowercase(){return this.addValidator({message:(e,t)=>`Expected ${t} to be lowercase, got \`${e}\``,validator:e=>""!==e.trim()&&e===e.toLowerCase()})}get uppercase(){return this.addValidator({message:(e,t)=>`Expected ${t} to be uppercase, got \`${e}\``,validator:e=>""!==e.trim()&&e===e.toUpperCase()})}get url(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a URL, got \`${e}\``,validator:a.default.urlString})}}t.StringPredicate=o},function(e,t,r){"use strict";e.exports=function(e){return!isNaN(Date.parse(e))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(0);class i extends n.Predicate{constructor(e){super("number",e)}inRange(e,t){return this.addValidator({message:(r,a)=>`Expected ${a} to be in range [${e}..${t}], got ${r}`,validator:r=>a.default.inRange(r,[e,t])})}greaterThan(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be greater than ${e}, got ${t}`,validator:t=>t>e})}greaterThanOrEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be greater than or equal to ${e}, got ${t}`,validator:t=>t>=e})}lessThan(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be less than ${e}, got ${t}`,validator:t=>t<e})}lessThanOrEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be less than or equal to ${e}, got ${t}`,validator:t=>t<=e})}equal(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be equal to ${e}, got ${t}`,validator:t=>t===e})}oneOf(e){return this.addValidator({message:(t,r)=>{let a=JSON.stringify(e);if(e.length>10){const t=e.length-10;a=JSON.stringify(e.slice(0,10)).replace(/]$/,`,…+${t} more]`)}return`Expected ${r} to be one of \`${a}\`, got ${t}`},validator:t=>e.includes(t)})}get integer(){return this.addValidator({message:(e,t)=>`Expected ${t} to be an integer, got ${e}`,validator:e=>a.default.integer(e)})}get finite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be finite, got ${e}`,validator:e=>!a.default.infinite(e)})}get infinite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be infinite, got ${e}`,validator:e=>a.default.infinite(e)})}get positive(){return this.addValidator({message:(e,t)=>`Expected ${t} to be positive, got ${e}`,validator:e=>e>0})}get negative(){return this.addValidator({message:(e,t)=>`Expected ${t} to be negative, got ${e}`,validator:e=>e<0})}get integerOrInfinite(){return this.addValidator({message:(e,t)=>`Expected ${t} to be an integer or infinite, got ${e}`,validator:e=>a.default.integer(e)||a.default.infinite(e)})}get uint8(){return this.integer.inRange(0,255)}get uint16(){return this.integer.inRange(0,65535)}get uint32(){return this.integer.inRange(0,4294967295)}get int8(){return this.integer.inRange(-128,127)}get int16(){return this.integer.inRange(-32768,32767)}get int32(){return this.integer.inRange(-2147483648,2147483647)}}t.NumberPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("boolean",e)}get true(){return this.addValidator({message:(e,t)=>`Expected ${t} to be true, got ${e}`,validator:e=>!0===e})}get false(){return this.addValidator({message:(e,t)=>`Expected ${t} to be false, got ${e}`,validator:e=>!1===e})}}t.BooleanPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(0),i=r(4);class o extends n.Predicate{constructor(e){super("array",e)}length(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have length \`${e}\`, got \`${t.length}\``,validator:t=>t.length===e})}minLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum length of \`${e-1}\`, got \`${t.length}\``})}maxLength(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum length of \`${e}\`, got \`${t.length}\``,validator:t=>t.length<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum length of \`${e+1}\`, got \`${t.length}\``})}startsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to start with \`${e}\`, got \`${t[0]}\``,validator:t=>t[0]===e})}endsWith(e){return this.addValidator({message:(t,r)=>`Expected ${r} to end with \`${e}\`, got \`${t[t.length-1]}\``,validator:t=>t[t.length-1]===e})}includes(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to include all elements of \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>e.every(e=>t.includes(e))})}includesAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to include any element of \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>e.some(e=>t.includes(e))})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify(e)}\``,validator:e=>0===e.length})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.length>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>a(t,e)})}ofType(e){let t;return this.addValidator({message:(e,r)=>`(${r}) ${t}`,validator:r=>{try{for(const t of r)i.default(t,e);return!0}catch(e){return t=e.message,!1}}})}}t.ArrayPredicate=o},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(26),i=r(5),o=r(3),s=r(7),d=r(28),c=r(29),u=r(0);class l extends u.Predicate{constructor(e){super("object",e)}get plain(){return this.addValidator({message:(e,t)=>`Expected ${t} to be a plain object`,validator:e=>a.default.plainObject(e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify(e)}\``,validator:e=>0===Object.keys(e).length})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>Object.keys(e).length>0})}valuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>s.default(Object.values(t),e)})}deepValuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>d.default(t,e)})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify(e)}\`, got \`${JSON.stringify(t)}\``,validator:t=>i(t,e)})}instanceOf(e){return this.addValidator({message:(t,r)=>{let{name:a}=t.constructor;return a&&"Object"!==a||(a=JSON.stringify(t)),`Expected ${r} \`${a}\` to be of type \`${e.name}\``},validator:t=>t instanceof e})}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>o.default({has:e=>n.has(t,e)},e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>n.has(t,e))})}partialShape(e){return this.addValidator({message:(e,t,r)=>`${r.replace("Expected","Expected property")} in ${t}`,validator:t=>c.partial(t,e)})}exactShape(e){return this.addValidator({message:(e,t,r)=>`${r.replace("Expected","Expected property")} in ${t}`,validator:t=>c.exact(t,e)})}}t.ObjectPredicate=l},function(e,t,r){"use strict";const a=r(27),n=["__proto__","prototype","constructor"],i=e=>!e.some(e=>n.includes(e));function o(e){const t=e.split("."),r=[];for(let e=0;e<t.length;e++){let a=t[e];for(;"\\"===a[a.length-1]&&void 0!==t[e+1];)a=a.slice(0,-1)+".",a+=t[++e];r.push(a)}return i(r)?r:[]}e.exports={get(e,t,r){if(!a(e)||"string"!=typeof t)return void 0===r?e:r;const n=o(t);if(0!==n.length){for(let t=0;t<n.length;t++){if(!Object.prototype.propertyIsEnumerable.call(e,n[t]))return r;if(null==(e=e[n[t]])){if(t!==n.length-1)return r;break}}return e}},set(e,t,r){if(!a(e)||"string"!=typeof t)return e;const n=e,i=o(t);for(let t=0;t<i.length;t++){const n=i[t];a(e[n])||(e[n]={}),t===i.length-1&&(e[n]=r),e=e[n]}return n},delete(e,t){if(!a(e)||"string"!=typeof t)return;const r=o(t);for(let t=0;t<r.length;t++){const n=r[t];if(t===r.length-1)return void delete e[n];if(e=e[n],!a(e))return}},has(e,t){if(!a(e)||"string"!=typeof t)return!1;const r=o(t);if(0===r.length)return!1;for(let t=0;t<r.length;t++){if(!a(e))return!1;if(!(r[t]in e))return!1;e=e[r[t]]}return!0}}},function(e,t,r){"use strict";e.exports=e=>{const t=typeof e;return null!==e&&("object"===t||"function"===t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(4),i=(e,t)=>a.default.plainObject(e)?Object.values(e).every(e=>i(e,t)):(n.default(e,t),!0);t.default=(e,t)=>{try{return i(e,t)}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(1),n=r(9),i=r(2);t.partial=function e(t,r,o){try{for(const s of Object.keys(r)){const d=o?`${o}.${s}`:s;if(i.isPredicate(r[s]))n.default(t[s],d,r[s]);else if(a.default.plainObject(r[s])){const a=e(t[s],r[s],d);if(!0!==a)return a}}return!0}catch(e){return e.message}},t.exact=function e(t,r,o){try{const s=new Set(Object.keys(t));for(const d of Object.keys(r)){s.delete(d);const c=o?`${o}.${d}`:d;if(i.isPredicate(r[d]))n.default(t[d],c,r[d]);else if(a.default.plainObject(r[d])){if(!Object.prototype.hasOwnProperty.call(t,d))return`Expected \`${c}\` to exist`;const a=e(t[d],r[d],c);if(!0!==a)return a}}if(s.size>0){const e=[...s.keys()][0];return`Did not expect property \`${o?`${o}.${e}`:e}\` to exist, got \`${t[e]}\``}return!0}catch(e){return e.message}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("date",e)}before(e){return this.addValidator({message:(t,r)=>`Expected ${r} ${t.toISOString()} to be before ${e.toISOString()}`,validator:t=>t.getTime()<e.getTime()})}after(e){return this.addValidator({message:(t,r)=>`Expected ${r} ${t.toISOString()} to be after ${e.toISOString()}`,validator:t=>t.getTime()>e.getTime()})}}t.DatePredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(0);class n extends a.Predicate{constructor(e){super("error",e)}name(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have name \`${e}\`, got \`${t.name}\``,validator:t=>t.name===e})}message(e){return this.addValidator({message:(t,r)=>`Expected ${r} message to be \`${e}\`, got \`${t.message}\``,validator:t=>t.message===e})}messageIncludes(e){return this.addValidator({message:(t,r)=>`Expected ${r} message to include \`${e}\`, got \`${t.message}\``,validator:t=>t.message.includes(e)})}hasKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} message to have keys \`${e.join("`, `")}\``,validator:t=>e.every(e=>Object.prototype.hasOwnProperty.call(t,e))})}instanceOf(e){return this.addValidator({message:(t,r)=>`Expected ${r} \`${t.name}\` to be of type \`${e.name}\``,validator:t=>t instanceof e})}get typeError(){return this.instanceOf(TypeError)}get evalError(){return this.instanceOf(EvalError)}get rangeError(){return this.instanceOf(RangeError)}get referenceError(){return this.instanceOf(ReferenceError)}get syntaxError(){return this.instanceOf(SyntaxError)}get uriError(){return this.instanceOf(URIError)}}t.ErrorPredicate=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(3),i=r(7),o=r(0);class s extends o.Predicate{constructor(e){super("Map",e)}size(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have size \`${e}\`, got \`${t.size}\``,validator:t=>t.size===e})}minSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum size of \`${e-1}\`, got \`${t.size}\``})}maxSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum size of \`${e+1}\`, got \`${t.size}\``})}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>n.default(t,e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}hasValues(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have values \`${JSON.stringify(r)}\``,validator:t=>n.default(new Set(t.values()),e)})}hasAnyValues(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any value of \`${JSON.stringify(e)}\``,validator:t=>{const r=new Set(t.values());return e.some(e=>r.has(e))}})}keysOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t.keys(),e)})}valuesOfType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t.values(),e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify([...e])}\``,validator:e=>0===e.size})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.size>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify([...e])}\`, got \`${JSON.stringify([...t])}\``,validator:t=>a(t,e)})}}t.MapPredicate=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(3),n=r(0);class i extends n.Predicate{constructor(e){super("WeakMap",e)}hasKeys(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have keys \`${JSON.stringify(r)}\``,validator:t=>a.default(t,e)})}hasAnyKeys(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any key of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}}t.WeakMapPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(5),n=r(3),i=r(7),o=r(0);class s extends o.Predicate{constructor(e){super("Set",e)}size(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have size \`${e}\`, got \`${t.size}\``,validator:t=>t.size===e})}minSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a minimum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size>=e,negatedMessage:(t,r)=>`Expected ${r} to have a maximum size of \`${e-1}\`, got \`${t.size}\``})}maxSize(e){return this.addValidator({message:(t,r)=>`Expected ${r} to have a maximum size of \`${e}\`, got \`${t.size}\``,validator:t=>t.size<=e,negatedMessage:(t,r)=>`Expected ${r} to have a minimum size of \`${e+1}\`, got \`${t.size}\``})}has(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have items \`${JSON.stringify(r)}\``,validator:t=>n.default(t,e)})}hasAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any item of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}ofType(e){return this.addValidator({message:(e,t,r)=>`(${t}) ${r}`,validator:t=>i.default(t,e)})}get empty(){return this.addValidator({message:(e,t)=>`Expected ${t} to be empty, got \`${JSON.stringify([...e])}\``,validator:e=>0===e.size})}get nonEmpty(){return this.addValidator({message:(e,t)=>`Expected ${t} to not be empty`,validator:e=>e.size>0})}deepEqual(e){return this.addValidator({message:(t,r)=>`Expected ${r} to be deeply equal to \`${JSON.stringify([...e])}\`, got \`${JSON.stringify([...t])}\``,validator:t=>a(t,e)})}}t.SetPredicate=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(3),n=r(0);class i extends n.Predicate{constructor(e){super("WeakSet",e)}has(...e){return this.addValidator({message:(e,t,r)=>`Expected ${t} to have items \`${JSON.stringify(r)}\``,validator:t=>a.default(t,e)})}hasAny(...e){return this.addValidator({message:(t,r)=>`Expected ${r} to have any item of \`${JSON.stringify(e)}\``,validator:t=>e.some(e=>t.has(e))})}}t.WeakSetPredicate=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=r(8),n=r(2);t.AnyPredicate=class{constructor(e,t={}){this.predicates=e,this.options=t}[n.testSymbol](e,t,r){const n=["Any predicate failed with the following errors:"];for(const a of this.predicates)try{return void t(e,r,a)}catch(t){if(void 0===e&&!0===this.options.optional)return;n.push(`- ${t.message}`)}throw new a.ArgumentError(n.join("\n"),t)}}}]);const __export__=module.exports;module.exports=__export__.default,Object.assign(module.exports,__export__);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2,"fs":1,"url":7}]},{},[9]);
