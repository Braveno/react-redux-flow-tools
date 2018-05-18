"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareProps = exports.not = exports.deepFreeze = exports.valueToString = exports.flatMap = exports.just = exports.withDefault = exports.isNumber = exports.isObject = exports.isDefined = exports.ident = exports.noop = exports.NOPComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _actions = require("./actions");

Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});

var _reducers = require("./reducers");

Object.keys(_reducers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reducers[key];
    }
  });
});

var _fastDeepEqual = require("fast-deep-equal");

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NOPComponent = exports.NOPComponent = function NOPComponent() {
  return null;
};

var noop = exports.noop = function noop() {};

var ident = exports.ident = function ident(x) {
  return x;
};
var isDefined = exports.isDefined = function isDefined(value) {
  return value != null;
};
var isObject = exports.isObject = function isObject(obj) {
  return isDefined(obj) && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
};
var isNumber = exports.isNumber = function isNumber(number) {
  if (number != null && number !== "") {
    var coerced = Number(number);
    return !isNaN(coerced) && isFinite(coerced);
  } else {
    return false;
  }
};
var withDefault = exports.withDefault = function withDefault(value, d) {
  return value !== undefined && value !== null ? value : d;
};

var just = exports.just = function just(value) {
  if (value != null) {
    return value;
  } else {
    throw new Error("ValueError: provided value is undefined and not `just`");
  }
};

/** @todo replace with https://tc39.github.io/proposal-flatMap/ 2018 */
var flatMap = exports.flatMap = function flatMap(arr, f) {
  return arr.reduce(function (x, y) {
    return [].concat(_toConsumableArray(x), _toConsumableArray(f(y)));
  }, []);
};

var valueToString = exports.valueToString = function valueToString(value) {
  if (value === undefined) {
    return "undefined";
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
  for (var _len = arguments.length, deep = Array(_len), _key = 0; _key < _len; _key++) {
    deep[_key] = arguments[_key];
  }

  return function (props, nextProps) {
    if (deep.length === 0) {
      return props === nextProps;
    }
    var namesProps = Object.getOwnPropertyNames(props).sort();
    var namesNextProps = Object.getOwnPropertyNames(nextProps).sort();
    if ((0, _fastDeepEqual2.default)(namesProps, namesNextProps)) {
      return namesProps.every(function (k) {
        if (deep.includes(k)) {
          return (0, _fastDeepEqual2.default)(props[k], nextProps[k]);
        } else {
          return props[k] === nextProps[k];
        }
      });
    } else {
      return false;
    }
  };
};