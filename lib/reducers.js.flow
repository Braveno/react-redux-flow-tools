// @flow

import type { ActionCreatorType, ActionType } from "./actions";

export const actionHandler = <T, S>(
  action: ActionCreatorType<T>,
  handler: (S, ActionType<T>) => S,
) => ({
  [action.toString()]: handler,
});
