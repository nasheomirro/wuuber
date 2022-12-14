import { ActionCreator, createAction } from './createAction';
import { ContainsFlows, Flow, Next } from './createDispatch';

export type Reducer<T = any> = Next<T>;
type Reducers = { [key: string]: Reducer<any> };
type GetActionCreator<T> = T extends Reducer<infer PT>
  ? ActionCreator<PT>
  : never;
interface ReducerWithFlows<T extends Reducers> extends ContainsFlows {
  actions: { [key in keyof T]: GetActionCreator<T[key]> };
}

export function createReducer<T extends Reducers>(reducers: T): ReducerWithFlows<T>;
export function createReducer<T extends Reducers>(
  name: string,
  reducers: T,
): ReducerWithFlows<T>;
export function createReducer<T extends Reducers>(
  name: T | string,
  reducers?: T,
): any {
  const map: { [key: string]: Reducer } = {};
  const actions: { [key: string]: ActionCreator<any> } = {};
  
  const actualReducers = reducers || name;

  for (const entry of Object.entries(actualReducers)) {
    const [key, value] = entry;
    const newName = reducers ? `${name}/${key}` : key;

    map[newName] = value;
    actions[key] = createAction(newName);
  }

  const reducer: Flow = (action, options) => {
    if (map[action.type]) map[action.type](action);
    return options.next(action);
  };

  return {
    __flows: reducer,
    actions,
  };
}
