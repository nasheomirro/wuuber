import { ContainsFlows, Flow } from './createDispatch';

// this was heavily "inspired" by Redux Toolkit's createAction function, thank you for the types
// https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/src/createAction.ts

export type Action<T = any> = {
  type: string;
  payload: T;
};

export type BaseCreator<PT> = ContainsFlows & {
  type: string;
  match: (action: Action) => action is Action<PT>;
};
export type CreatorWithPayload<PT> = BaseCreator<PT> & {
  (payload: PT): Action<PT>;
};
export type CreatorOptionalPayload<PT> = BaseCreator<PT> & {
  (payload?: PT): Action<PT>;
};
export type CreatorEmptyPayload = BaseCreator<void> & {
  (): Action<void>;
};

export type ActionCreator<P> = true | false extends (
  P extends never ? true : false
)
  ? CreatorWithPayload<any> // payload can be anything
  : [void] extends [P]
  ? CreatorEmptyPayload // payload is void
  : [undefined] extends [P]
  ? CreatorOptionalPayload<P> // payload can be undefined
  : CreatorWithPayload<P>; // payload is never undefined

export function createAction<P = void>(type: string, ...flows: Flow[]): ActionCreator<P>;
export function createAction(type: string, ...flows: Flow[]): any {
  function actionCreator(...args: any[]) {
    return {
      type,
      payload: args[0],
    };
  }

  actionCreator.match = (action: Action<unknown>) => action?.type === type;
  actionCreator.type = type;
  actionCreator.__flows = flows;

  return actionCreator;
}