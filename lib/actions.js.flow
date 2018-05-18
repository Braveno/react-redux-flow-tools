// @flow
export type ActionType<T> = { +type: string, +payload: T };
export type PureActionCreatorType = () => ActionType<mixed | typeof undefined>;
export type ActionCreatorType<T> = (T) => ActionType<T>;

export type GetStateType<T> = () => T;
export type DispatchType = <T, S>(
  ActionType<T> | ((DispatchType, GetStateType<S>) => void | Promise<mixed>),
) => ActionType<T> | void;
