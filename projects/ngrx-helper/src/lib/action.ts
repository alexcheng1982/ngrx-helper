import { Store } from '@ngrx/store';
import uuid from 'uuid';
import {
  ActionHelper, Entity,
  isStoreAction,
  RequestErrorAction,
  RequestSuccessAction,
  RequestType,
  SendRequestAction,
  StoreAction,
  StoreActionType,
  SymbolEntity,
  SymbolRequest,
  SymbolRequestType,
  SymbolStoreActionType,
} from './common';


const isSendRequestAction = (name: string, action: any, requestType: RequestType) => {
  return isStoreAction(name, action)
    && (action as StoreAction)[SymbolStoreActionType] === StoreActionType.REQUEST
    && (action as SendRequestAction<any>)[SymbolRequestType] === requestType;
};

const actionId = () => uuid();

const actionType = (name: string, requestType: RequestType, storeActionType: StoreActionType) =>
  `NgRxHelper_${name}_${requestType.name}_${StoreActionType[storeActionType]}`;

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

export function createActionHelper<T extends Entity, E>(name: string, store: Store<any>): ActionHelper<T, E> {
  return {
    actionType,
    isSendRequestAction,
    createRequestAction<R>(requestType: RequestType, request: R = null): SendRequestAction<R> {
      return createRequestAction(name, requestType, request);
    },

    createSuccessAction<R>(data: T[] | T | string, requestAction: SendRequestAction<R>): RequestSuccessAction<T, R> {
      return createSuccessAction(name, data, requestAction);
    },

    createErrorAction<R>(error: E, requestAction: SendRequestAction<R>): RequestErrorAction<R, E> {
      return createErrorAction(name, error, requestAction);
    },

    clearAction(action: StoreAction | string) {
      const clearAction: SendRequestAction<any> = {
        id: actionId(),
        type: actionType(name, RequestType.CLEAR_ACTION, StoreActionType.INTERNAL),
        [SymbolEntity]: name,
        [SymbolRequestType]: RequestType.CLEAR_ACTION,
        [SymbolStoreActionType]: StoreActionType.INTERNAL,
        payload: action,
      };
      store.dispatch(clearAction);
    },

    sendRequestAction<R>(requestType: RequestType, request?: R): SendRequestAction<R> {
      const action = createRequestAction(name, requestType, request);
      store.dispatch(action);
      return action;
    },

    sendSuccessAction<R>(data: T[] | T | string, requestAction: SendRequestAction<R>): RequestSuccessAction<T, R> {
      const action = createSuccessAction(name, data, requestAction);
      store.dispatch(action);
      return action;
    },

    sendErrorAction<R>(error: E, requestAction: SendRequestAction<R>): RequestErrorAction<R, E> {
      const action = createErrorAction(name, error, requestAction);
      store.dispatch(action);
      return action;
    },

    clearData(): void {
      const action: SendRequestAction<any> = {
        id: actionId(),
        type: actionType(name, RequestType.CLEAR_DATA, StoreActionType.INTERNAL),
        [SymbolEntity]: name,
        [SymbolRequestType]: RequestType.CLEAR_DATA,
        [SymbolStoreActionType]: StoreActionType.INTERNAL,
        payload: null,
      };
      store.dispatch(action);
    },

  };
}
