// @flow

import deepEqual from "fast-deep-equal";

export * from "./actions";
export * from "./reducers";

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
export const isEmpty = (obj?: {} | Array<mixed>): boolean => {
  //courtesy of https://stackoverflow.com/questions/4994201/is-object-empty
  // null and undefined are "empty"
  if (obj == null) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj instanceof Array) {
    return obj.length === 0;
  } else {
    // Otherwise, does it have any properties of its own?
    return Object.getOwnPropertyNames(obj).length > 0;
  }
};
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

export const maybePath = (
  obj: {},
  ...path: $ReadOnlyArray<string | number>
): mixed | typeof undefined => {
  if (obj == null || path.length === 0) {
    return undefined;
  }
  const key = path[0];
  const rest = path.slice(1);
  if (obj instanceof Object && obj.hasOwnProperty(key)) {
    if (rest.length === 0) {
      return obj[key];
    } else {
      return maybePath(obj[key], ...rest);
    }
  }
};

export const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined") {
      throw new Error("AssertionError: " + message);
    }
    throw message; // Fallback
  }
};

export const just = <T>(value: ?T): T => {
  if (value != null) {
    return (value: T);
  } else {
    // clunky because of flow
    assert(false, "provided value is undefined and not `just`");
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
  if (!isDefined(obj) || !isObject(obj) || typeof Object.isFrozen === "undefined" || Object.isFrozen(obj)) {
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
  process.env.NODE_ENV !== "development" ? ident : _deepFreeze;

export const not = (fun: (...args: $ReadOnlyArray<mixed>) => boolean) => (
  ...args: $ReadOnlyArray<mixed>
): boolean => !fun(...args);

export type PropsCompareType<T: {}> = (T, T) => boolean;

export const compareProps = <T: {}>(
  ...deep: $Keys<T>[]
): PropsCompareType<T> => (props: T, nextProps: T): boolean => {
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

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

export const filterRegexBy = <T>(
  filter: string,
  lens?: (T) => string = JSON.stringify,
): ((T) => boolean) => {
  // const cleanFilter = filter.replace(/\s+/, '');
  const cleanFilter = filter.trim();
  if (cleanFilter === "") {
    return () => true;
  }
  const regex = new RegExp(
    `.*${cleanFilter
      .split("")
      .map(escapeRegExp)
      .join(".*")}.*`,
    "i",
  );
  return (element) => regex.test(lens(element));
};

/**
 * perform a naive check to see wether the array should be sorted based on a few indices
 * @param comparator comparator function for the array
 * @param array the array to be sorted
 * @return the sorted (if necessary) array
 */
// Note: flow has a hiccup on a curried version so needs to be curried by consumer
export const testSort = <T>(
  comparator: (T, T) => number,
  array: $ReadOnlyArray<T>,
): $ReadOnlyArray<T> => {
  if (array.length < 2) {
    return array;
  }

  if (process.env.NODE_ENV !== "production") {
    // check full array during development
    const isSorted = array.every((value, index, array) => {
      return index === 0 || comparator(array[index - 1], value) <= 0;
    });
    if (!isSorted) {
      console.warn(
        `Provided array is unsorted according to ${comparator.name}`,
      );
      // todo adapt deepFreeze for arrays as well
      return array.slice(0).sort(comparator);
    } else {
      return array;
    }
  } else {
    // perform optimistic check of subset of the array
    const lastIdx = array.length - 1;
    const testIdxs = [
      Math.round(lastIdx / 3),
      Math.round(lastIdx * 0.6666667),
      lastIdx,
    ];
    let previousElement = array[0];
    for (const testIdx of testIdxs) {
      const compareValue = comparator(previousElement, array[testIdx]);
      if (compareValue > 0) {
        console.warn(
          `Provided array is unsorted sorted according to ${comparator.name}!
          ${valueToString(array[testIdx])}
          is smaller than
          ${valueToString(previousElement)}`,
        );
        // todo adapt deepFreeze for arrays as well
        return array.slice(0).sort(comparator);
      }
      previousElement = array[testIdx];
    }
    return array;
  }
};


