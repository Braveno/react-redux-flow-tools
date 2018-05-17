import deepEqual from "fast-deep-equal";

export const NOPComponent = () => null;

export const noop = () => {};

export const ident = <T>(x: T): T => x;
export const isDefined = (value?: *): boolean =>
  value !== undefined && value !== null;
export const isObject = (obj?: *): boolean =>
  isDefined(obj) && typeof obj === "object";
export const isNumber = (number: *): boolean =>
  !isNaN(Number(number)) && isFinite(number);
export const withDefault = <T>(value?: T, d: T): T =>
  value !== undefined && value !== null ? (value: T) : d;

export const matchExpected = <T>(value: *): T => value;
export const just = <T>(value?: ?T): T => {
  if (isDefined(value)) {
    return matchExpected(value);
  } else {
    throw new Error("ValueError: provided value is undefined and not `just`");
  }
};

/** @todo $Supertype should be $Shape but proposal unclear atm */
export const assign = <T: {}>(
  target: T,
  ...sources: $ReadOnlyArray<$Supertype<T>>
): $ReadOnly<T> => deepFreeze(Object.assign({}, target, ...sources));

/** @todo replace with https://tc39.github.io/proposal-flatMap/ 2018 */
export const flatMap = <T, S>(
  arr: $ReadOnlyArray<T>,
  f: (T) => $ReadOnlyArray<S>,
) => arr.reduce((x, y) => [...x, ...f(y)], []);

/** @todo Supertype should be Shape. currently allows for spurious members but needs more thought */
export const _updateIn = (upsert: boolean) => <T: {}>(
  target: T,
  ...sources: $Supertype<T>[]
): $ReadOnly<T> =>
  assign(
    target,
    ...flatMap(sources, (source) =>
      Object.keys(source).map((k) => {
        if (
          target === undefined ||
          (target !== null && !target.hasOwnProperty(k))
        ) {
          // check necessary because of $Supertype / $Shape uncertainty
          if (upsert) {
            return Object.freeze({ [k]: source[k] });
          } else {
            throw new Error(
              `TypeError: Object ${valueToString(
                target,
              )} has no key ${k} and upsert is ${upsert.toString()}`,
            );
          }
        } else if (
          isObject(source[k]) &&
          !(source[k] instanceof Array) &&
          source[k].constructor.name === "Object"
        ) {
          return Object.freeze({
            [k]: assign(target[k], _updateIn(upsert)(target[k], source[k])),
          });
        } else {
          return Object.freeze({ [k]: source[k] });
        }
      }),
    ),
  );

export const updateIn = _updateIn(false);

export const upsertIn = _updateIn(true);

export const valueToString = <T>(value: T): string => {
  if (value === undefined) {
    return "undefined";
  } else if (value === null) {
    return "null";
  } else {
    return JSON.stringify(value);
  }
};

// courtesy of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
const _deepFreeze = <T: {}>(obj: T): $ReadOnly<T> => {
  if (!isDefined(obj) || Object.isFrozen(obj)) {
    return obj;
  }

  // TODO is necessary @Christian? If yes platform specific files needed
  // if (typeof window !== 'undefined' && (obj === window || obj === document)) {
  //   throw new Error('ValueError: can\'t freeze protected variables');
  // }
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

export const deepFreeze = _deepFreeze; // process.env.NODE_ENV === 'production' ? ident : _deepFreeze;

export const not = (fun: (...args: $ReadOnlyArray<*>) => boolean) => (
  ...args: $ReadOnlyArray<*>
): boolean => !fun(...args);

export const compareProps = <T: {}>(
  ...deep: $Keys<T>[]
): ((T, T) => boolean) => (props: T, nextProps: T): boolean => {
  if (deep.length === 0) {
    return props === nextProps;
  }
  const namesProps = Object.getOwnPropertyNames(props);
  const namesNextProps = Object.getOwnPropertyNames(nextProps);
  if (!deepEqual(namesProps, namesNextProps)) {
    return false;
  } else {
    return namesProps.every((k) => {
      if (deep.includes(k)) {
        return deepEqual(props[k], nextProps[k]);
      } else {
        return props[k] === nextProps[k];
      }
    });
  }
};

export type PropsCompareType<T: {}> = (T, T) => boolean;
