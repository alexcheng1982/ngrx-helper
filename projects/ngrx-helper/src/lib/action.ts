import {Action, Store} from '@ngrx/store';
import uuid from 'uuid/v1';
import {Observable} from 'rxjs';

export type RequestSender<T, R> = (request: R) => Observable<T[] | T | string>;

export enum StoreActionType {
  REQUEST,
  SUCCESS,
  ERROR,
  INTERNAL,
}

export enum RequestType {
  LIST,
  GET,
  CREATE,
  UPDATE,
  DELETE,
}

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

const isSendRequestAction = (name: string, action: any, requestType: RequestType) => {
  return isStoreAction(name, action)
    && (action as StoreAction)[SymbolStoreActionType] === StoreActionType.REQUEST
    && (action as SendRequestAction<any>)[SymbolRequestType] === requestType;
};

const actionId = () => uuid();

const actionType = (name: string, requestType: RequestType, storeActionType: StoreActionType) =>
  `NgRxHelper_${name}_${RequestType[requestType]}_${StoreActionType[storeActionType]}`;

const createRequestAction = <R>(name: string, requestType: RequestType, request: R = null): SendRequestAction<R> => ({
  id: actionId(),
  type: actionType(name, requestType, StoreActionType.REQUEST),
  [SymbolEntity]: name,
  [SymbolRequestType]: requestType,
  [SymbolStoreActionType]: StoreActionType.REQUEST,
  payload: request,
});

const createSuccessAction = <T, R>(name: string,
                                   data: T[] | T | string,
                                   requestAction: SendRequestAction<R>): RequestSuccessAction<T, R> => ({
  id: actionId(),
  type: actionType(name, requestAction[SymbolRequestType], StoreActionType.SUCCESS),
  [SymbolRequest]: requestAction,
  [SymbolEntity]: name,
  [SymbolStoreActionType]: StoreActionType.SUCCESS,
  payload: data,
});

const createErrorAction = <E, R>(name: string, error: E, requestAction: SendRequestAction<R>): RequestErrorAction<R, E> => ({
  id: actionId(),
  type: actionType(name, requestAction[SymbolRequestType], StoreActionType.ERROR),
  [SymbolRequest]: requestAction,
  [SymbolEntity]: name,
  [SymbolStoreActionType]: StoreActionType.ERROR,
  payload: error,
});

export function createActionHelper<T, E>(name: string, store: Store<any>): ActionHelper<T, E> {
  return {
    isSendRequestAction,
    requestAction<R>(requestType: RequestType, request: R = null) {
      return createRequestAction(name, requestType, request);
    },

    successAction<R>(data: T[] | T | string, requestAction: SendRequestAction<R>) {
      return createSuccessAction(name, data, requestAction);
    },

    errorAction<R>(error: E, requestAction: SendRequestAction<R>) {
      return createErrorAction(name, error, requestAction);
    },

    clearActionErrorAction(action: StoreAction | string) {
      return {
        id: actionId(),
        type: actionType(name, RequestType.DELETE, StoreActionType.INTERNAL),
        [SymbolEntity]: name,
        payload: action,
      };
    },

    sendRequestAction<R>(requestType: RequestType, request: R = null) {
      store.dispatch(createRequestAction(name, requestType, request));
    },

    sendSuccessAction<R>(data: T[] | T | string, requestAction: SendRequestAction<R>) {
      store.dispatch(createSuccessAction(name, data, requestAction));
    },

    sendErrorAction<R>(error: E, requestAction: SendRequestAction<R>) {
      store.dispatch(createErrorAction(name, error, requestAction));
    }

  };
}

export interface ActionHelper<T, E> {
  isSendRequestAction: (name: string, action: any, requestType: RequestType) => boolean;
  requestAction: <R>(requestType: RequestType, request: R) => SendRequestAction<R>;
  successAction: <R>(data: T[] | T | string, requestAction: SendRequestAction<R>) => RequestSuccessAction<T, R>;
  errorAction: <R>(error: E, requestAction: SendRequestAction<R>) => RequestErrorAction<R, E>;
  clearActionErrorAction: (action: StoreAction | string) => any;
  sendRequestAction: <R>(requestType: RequestType, request: R) => void;
  sendSuccessAction: <R>(data: T[] | T | string, requestAction: SendRequestAction<R>) => void;
  sendErrorAction: <R>(error: E, requestAction: SendRequestAction<R>) => void;
}
