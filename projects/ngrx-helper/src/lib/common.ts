import { Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { Action, Selector } from '@ngrx/store';

export const SINGLE_ITEM_ID = '__single__';

export enum StoreActionType {
  REQUEST,
  SUCCESS,
  ERROR,
  INTERNAL,
}

export class RequestType {
  constructor(public name: string) {
  }

  static LIST = new RequestType('LIST');
  static GET = new RequestType('GET');
  static CREATE = new RequestType('CREATE');
  static UPDATE = new RequestType('UPDATE');
  static DELETE = new RequestType('DELETE');
  static GET_SINGLE = new RequestType('GET_SINGLE');
  static CREATE_SINGLE = new RequestType('CREATE_SINGLE');
  static UPDATE_SINGLE = new RequestType('UPDATE_SINGLE');
  static DELETE_SINGLE = new RequestType('DELETE_SINGLE');
  static CLEAR_ACTION = new RequestType('CLEAR_ACTION');
  static CLEAR_DATA = new RequestType('CLEAR_DATA');
}

export type RequestSender<T, R> = (request: R) => Observable<T[] | T | string>;

export const SymbolEntity = Symbol('Entity');
export const SymbolRequestType = Symbol('Request type');
export const SymbolRequest = Symbol('Request action');
export const SymbolStoreActionType = Symbol('Store action type');

export interface StoreAction extends Action {
  id: string;
  [SymbolEntity]: string;
  [SymbolStoreActionType]: StoreActionType;
}

export interface SendRequestAction<R> extends StoreAction {
  [SymbolRequestType]: RequestType;
  payload: R;
}

interface RequestResultAction<R> extends StoreAction {
  [SymbolRequest]: SendRequestAction<R>;
}

export interface RequestSuccessAction<T, R> extends RequestResultAction<R> {
  payload: T[] | T | string;
}

export interface RequestErrorAction<R, E> extends RequestResultAction<R> {
  payload: E;
}

export const isStoreAction = (name: string, action: any) => {
  return action && action.hasOwnProperty(SymbolStoreActionType) && (action as StoreAction)[SymbolEntity] === name;
};

export interface Entity {
  id: string;
}

export interface ActionStatus<E> {
  action: StoreAction;
  loading?: boolean;
  error?: E;
}

export interface State<T extends Entity, E> {
  entities: EntityState<T>;
  actions: EntityState<ActionStatus<E>>;
}

export interface ReducerHelper<T extends Entity, E> {
  reducer: (state: State<T, E>, action: any) => State<T, E>;
  entitiesAdapter: EntityAdapter<T>;
  actionsAdapter: EntityAdapter<ActionStatus<E>>;
}

export interface ActionHelper<T extends Entity, E> {
  actionType: (name: string, requestType: RequestType, storeActionType: StoreActionType) => string;
  isSendRequestAction: (name: string, action: any, requestType: RequestType) => boolean;
  createRequestAction: <R>(requestType: RequestType, request?: R) => SendRequestAction<R>;
  createSuccessAction: <R>(data: T[] | T | string, requestAction: SendRequestAction<R>) => RequestSuccessAction<T, R>;
  createErrorAction: <R>(error: E, requestAction: SendRequestAction<R>) => RequestErrorAction<R, E>;
  clearAction: (action: StoreAction | string) => void;
  sendRequestAction: <R>(requestType: RequestType, request?: R) => void;
  sendSuccessAction: <R>(data: T[] | T | string, requestAction: SendRequestAction<R>) => void;
  sendErrorAction: <R>(error: E, requestAction: SendRequestAction<R>) => void;
  clearData: () => void;
}

export interface EffectsHelper<T extends Entity> {
  listEffect: <R>(requestSender: RequestSender<T, R>,
                  successActions?: Observable<Action>,
                  errorActions?: Observable<Action>) => Observable<Action>;
  getEffect: <R>(requestSender: RequestSender<T, R>,
                 successActions?: Observable<Action>,
                 errorActions?: Observable<Action>) => Observable<Action>;
  createEffect: <R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) => Observable<Action>;
  updateEffect: <R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) => Observable<Action>;
  deleteEffect: <R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) => Observable<Action>;
  getSingleEffect: <R>(requestSender: RequestSender<T, R>,
                       successActions?: Observable<Action>,
                       errorActions?: Observable<Action>) => Observable<Action>;
  createSingleEffect: <R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) => Observable<Action>;
  updateSingleEffect: <R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) => Observable<Action>;
  deleteSingleEffect: <R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) => Observable<Action>;
  customEffect: <R>(requestType: RequestType,
                    requestSender: RequestSender<T, R>, successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) => Observable<Action>;
}


export interface SelectorHelper<T extends Entity, E> {
  entitiesSelectAllSelector: Selector<State<T, E>, T[]>;
  entitiesSelectEntitiesSelector: Selector<State<T, E>, Dictionary<T>>;
  entitiesSelectIdsSelector: Selector<State<T, E>, number[] | string[]>;
  entitiesSelectTotalSelector: Selector<State<T, E>, number>;
  entitiesSelectSingleSelector: Selector<State<T, E>, T>;
  isActionLoadingSelector: (any) => Selector<State<T, E>, boolean>;
  actionErrorSelector: (any) => Selector<State<T, E>, E>;
  hasPendingActionsSelector: (type: RequestType) => Selector<State<T, E>, boolean>;
  entitiesSelectAll: Observable<T[]>;
  entitiesSelectEntities: Observable<Dictionary<T>>;
  entitiesSelectIds: Observable<number[] | string[]>;
  entitiesSelectTotal: Observable<number>;
  entitiesSelectSingle: Observable<T>;
  isActionLoading: (any) => Observable<boolean>;
  actionError: (action) => Observable<E>;
  hasPendingActions: (type: RequestType) => Observable<boolean>;
}

export interface NgRxHelper<T extends Entity, E> {
  action: ActionHelper<T, E>;
  reducer: ReducerHelper<T, E>;
  effects: EffectsHelper<T>;
  selector: SelectorHelper<T, E>;
}
