"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareProps = exports.not = exports.deepFreeze = exports.valueToString = exports.upsertIn = exports.updateIn = exports._updateIn = exports.flatMap = exports.assign = exports.just = exports.matchExpected = exports.withDefault = exports.isNumber = exports.isObject = exports.isDefined = exports.ident = exports.noop = exports.NOPComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fastDeepEqual = require("fast-deep-equal");

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NOPComponent = exports.NOPComponent = function NOPComponent() {
  return null;
};

var noop = exports.noop = function noop() {};

var ident = exports.ident = function ident(x) {
  return x;
};
var isDefined = exports.isDefined = function isDefined(value) {
  return value !== undefined && value !== null;
};
var isObject = exports.isObject = function isObject(obj) {
  return isDefined(obj) && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
};
var isNumber = exports.isNumber = function isNumber(number) {
  return !isNaN(Number(number)) && isFinite(number);
};
var withDefault = exports.withDefault = function withDefault(value, d) {
  return value !== undefined && value !== null ? value : d;
};

var matchExpected = exports.matchExpected = function matchExpected(value) {
  return value;
};
var just = exports.just = function just(value) {
  if (isDefined(value)) {
    return matchExpected(value);
  } else {
    throw new Error("ValueError: provided value is undefined and not `just`");
  }
};

/** @todo $Supertype should be $Shape but proposal unclear atm */
var assign = exports.assign = function assign(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  return deepFreeze(Object.assign.apply(Object, [{}, target].concat(_toConsumableArray(sources))));
};

/** @todo replace with https://tc39.github.io/proposal-flatMap/ 2018 */
var flatMap = exports.flatMap = function flatMap(arr, f) {
  return arr.reduce(function (x, y) {
    return [].concat(_toConsumableArray(x), _toConsumableArray(f(y)));
  }, []);
};

/** @todo Supertype should be Shape. currently allows for spurious members but needs more thought */
var _updateIn = exports._updateIn = function _updateIn(upsert) {
  return function (target) {
    for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    return assign.apply(undefined, [target].concat(_toConsumableArray(flatMap(sources, function (source) {
      return Object.keys(source).map(function (k) {
        if (target === undefined || target !== null && !target.hasOwnProperty(k)) {
          // check necessary because of $Supertype / $Shape uncertainty
          if (upsert) {
            return Object.freeze(_defineProperty({}, k, source[k]));
          } else {
            throw new Error("TypeError: Object " + valueToString(target) + " has no key " + k + " and upsert is " + upsert.toString());
          }
        } else if (isObject(source[k]) && !(source[k] instanceof Array) && source[k].constructor.name === "Object") {
          return Object.freeze(_defineProperty({}, k, assign(target[k], _updateIn(upsert)(target[k], source[k]))));
        } else {
          return Object.freeze(_defineProperty({}, k, source[k]));
        }
      });
    }))));
  };
};

var updateIn = exports.updateIn = _updateIn(false);

var upsertIn = exports.upsertIn = _updateIn(true);

var valueToString = exports.valueToString = function valueToString(value) {
  if (value === undefined) {
    return "undefined";
  } else if (value === null) {
    return "null";
  } else {
    return JSON.stringify(value);
  }
};

// courtesy of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
var _deepFreeze = function _deepFreeze(obj) {
  if (!isDefined(obj) || Object.isFrozen(obj)) {
    return obj;
  }

  // Retrieve the property names defined on obj
  var propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach(function (name) {
    var prop = obj[name];

    if (prop instanceof Array) {
      obj[name] = Object.freeze(prop.map(deepFreeze));
    } else if (isDefined(prop) && (typeof prop === "undefined" ? "undefined" : _typeof(prop)) === "object") {
      obj[name] = _deepFreeze(prop);
    }
  });
  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
};

var deepFreeze = exports.deepFreeze = process.env.NODE_ENV === "production" ? ident : _deepFreeze;

var not = exports.not = function not(fun) {
  return function () {
    return !fun.apply(undefined, arguments);
  };
};

var compareProps = exports.compareProps = function compareProps() {
  for (var _len3 = arguments.length, deep = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    deep[_key3] = arguments[_key3];
  }

  return function (props, nextProps) {
    if (deep.length === 0) {
      return props === nextProps;
    }
    var namesProps = Object.getOwnPropertyNames(props);
    var namesNextProps = Object.getOwnPropertyNames(nextProps);
    if (!(0, _fastDeepEqual2.default)(namesProps, namesNextProps)) {
      return false;
    } else {
      return namesProps.every(function (k) {
        if (deep.includes(k)) {
          return (0, _fastDeepEqual2.default)(props[k], nextProps[k]);
        } else {
          return props[k] === nextProps[k];
        }
      });
    }
  };
};