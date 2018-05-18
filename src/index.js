// @flow
import deepEqual from "fast-deep-equal";

export const NOPComponent = () => null;

export type JSONField = number | string;
export type JSONType = {
  +[string]: $ReadOnlyArray<JSONField | JSONType> | JSONField,
};

export const noop = () => {};

export const ident = <T>(x: T): T => x;
export const isDefined = (value: ?mixed): boolean => value != null;
export const isObject = (obj: ?mixed): boolean =>
  isDefined(obj) && typeof obj === "object";
export const isNumber = (number: mixed): boolean => {
  if (number != null && number !== "") {
    const coerced = Number(number);
    return !isNaN(coerced) && isFinite(coerced);
  } else {
    return false;
  }
};
export const withDefault = <T>(value?: T, d: T): T =>
  value !== undefined && value !== null ? (value: T) : d;

export const just = <T>(value: ?T): T => {
  if (value != null) {
    return (value: T);
  } else {
    throw new Error("ValueError: provided value is undefined and not `just`");
  }
};

/** @todo replace with https://tc39.github.io/proposal-flatMap/ 2018 */
export const flatMap = <T, S>(
  arr: $ReadOnlyArray<T>,
  f: (T) => $ReadOnlyArray<S>,
) => arr.reduce((x, y) => [...x, ...f(y)], []);

export const valueToString = <T>(value: T): string => {
  if (value === undefined) {
    return "undefined";
  } else {
    return JSON.stringify(value);
  }
};

// courtesy of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
const _deepFreeze = <T: {}>(obj: T): $ReadOnly<T> => {
  if (!isDefined(obj) || Object.isFrozen(obj)) {
    return obj;
  }

  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  propNames.forEach((name) => {
    const prop = obj[name];

    if (prop instanceof Array) {
      obj[name] = Object.freeze(prop.map(deepFreeze));
    } else if (isDefined(prop) && typeof prop === "object") {
      obj[name] = _deepFreeze(prop);
    }
  });
  // Freeze self (no-op if already frozen)
  return Object.freeze(obj);
};

export const deepFreeze =
  process.env.NODE_ENV === "production" ? ident : _deepFreeze;

export const not = (fun: (...args: $ReadOnlyArray<mixed>) => boolean) => (
  ...args: $ReadOnlyArray<mixed>
): boolean => !fun(...args);

export const compareProps = <T: {}>(
  ...deep: $Keys<T>[]
): ((T, T) => boolean) => (props: T, nextProps: T): boolean => {
  if (deep.length === 0) {
    return props === nextProps;
  }
  const namesProps = Object.getOwnPropertyNames(props).sort();
  const namesNextProps = Object.getOwnPropertyNames(nextProps).sort();
  if (deepEqual(namesProps, namesNextProps)) {
    return namesProps.every((k) => {
      if (deep.includes(k)) {
        return deepEqual(props[k], nextProps[k]);
      } else {
        return props[k] === nextProps[k];
      }
    });
  } else {
    return false;
  }
};

export type PropsCompareType<T: {}> = (T, T) => boolean;

export * from "./actions";
export * from "./reducers";
