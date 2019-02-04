import {RequestSender, RequestType, SendRequestAction} from './action';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Actions} from '@ngrx/effects';
import {Action} from '@ngrx/store';

export function createEffectsHelper<T>(name: string, actionHelper: any, actions$: Actions): EffectsHelper<T> {

  const effect = <R>(requestType: RequestType, requestSender: RequestSender<T, R>): Observable<Action> => {
    return actions$.pipe(
      filter(action => actionHelper.isSendRequestAction(name, action, requestType)),
      mergeMap((action: SendRequestAction<R>) => requestSender(action.payload).pipe(
        map(response => actionHelper.successAction(response, action)),
        catchError(error => of(actionHelper.errorAction(error, action)))
      )),
    );
  };

  return {
    listEffect<R>(requestSender: RequestSender<T, R>) {
      return effect(RequestType.LIST, requestSender);
    },

    getEffect<R>(requestSender: RequestSender<T, R>) {
      return effect(RequestType.GET, requestSender);
    },

    createEffect<R>(requestSender: RequestSender<T, R>) {
      return effect(RequestType.CREATE, requestSender);
    },

    updateEffect<R>(requestSender: RequestSender<T, R>) {
      return effect(RequestType.UPDATE, requestSender);
    },

    deleteEffect<R>(requestSender: RequestSender<T, R>) {
      return effect(RequestType.DELETE, requestSender);
    },
  };
}

export interface EffectsHelper<T> {
  listEffect: <R>(requestSender: RequestSender<T, R>) => Observable<Action>;
  getEffect: <R>(requestSender: RequestSender<T, R>) => Observable<Action>;
  createEffect: <R>(requestSender: RequestSender<T, R>) => Observable<Action>;
  updateEffect: <R>(requestSender: RequestSender<T, R>) => Observable<Action>;
  deleteEffect: <R>(requestSender: RequestSender<T, R>) => Observable<Action>;
}
