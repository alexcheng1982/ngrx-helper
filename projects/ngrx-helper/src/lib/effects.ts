import { ActionHelper, RequestSender, RequestType, SendRequestAction, EffectsHelper } from './common';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

export function createEffectsHelper<T, E>(name: string, actionHelper: ActionHelper<T, E>, actions$: Actions): EffectsHelper<T> {

  const effect = <R>(requestType: RequestType, requestSender: RequestSender<T, R>): Observable<Action> => {
    return actions$.pipe(
      filter(action => actionHelper.isSendRequestAction(name, action, requestType)),
      mergeMap((action: SendRequestAction<R>) => requestSender(action.payload).pipe(
        map(response => actionHelper.createSuccessAction(response, action)),
        catchError(error => of(actionHelper.createErrorAction(error, action)))
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
