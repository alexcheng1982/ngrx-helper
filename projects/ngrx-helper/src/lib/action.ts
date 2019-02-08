import { Store } from '@ngrx/store';
import uuid from 'uuid/v1';
import {
  ActionHelper,
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
    createRequestAction<R>(requestType: RequestType, request: R = null): SendRequestAction<R> {
      return createRequestAction(name, requestType, request);
    },

    createSuccessAction<R>(data: T[] | T | string, requestAction: SendRequestAction<R>): RequestSuccessAction<T, R> {
      return createSuccessAction(name, data, requestAction);
    },

    createErrorAction<R>(error: E, requestAction: SendRequestAction<R>): RequestErrorAction<R, E> {
      return createErrorAction(name, error, requestAction);
    },

    clearActionErrorAction(action: StoreAction | string) {
      return {
        id: actionId(),
        type: actionType(name, RequestType.DELETE, StoreActionType.INTERNAL),
        [SymbolEntity]: name,
        [SymbolRequestType]: RequestType.DELETE,
        [SymbolStoreActionType]: StoreActionType.INTERNAL,
        payload: action,
      };
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
    }

  };
}
