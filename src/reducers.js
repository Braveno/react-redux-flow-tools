// @flow

import type { ActionCreatorType, ActionType } from "./actions";

export type ActionHandlerType<S, A = ?mixed> = (S, ActionType<A>) => S;
export type ActionHandlersType<S> = {| [string]: ActionHandlerType<S> |};

export const actionHandler = <S, A>(
  action: ActionCreatorType<A>,
  handler: ActionHandlerType<S, A>,
): ActionHandlersType<S> => ({
  [action.toString()]: handler,
});
