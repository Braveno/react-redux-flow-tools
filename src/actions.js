// @flow
export type ActionType<T> = { +type: string, +payload: T };
export type PureActionCreatorType = () => ActionType<mixed | typeof undefined>;
export type ActionCreatorType<T> = (T) => ActionType<T>;

export type GetStateType<S> = () => S;
export type DispatchType<S> = <T>(
  ActionType<T> | ((DispatchType<S>, GetStateType<S>) => void | Promise<mixed>),
) => ActionType<T> | void;
