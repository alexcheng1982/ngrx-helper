import { ActionHelper, EffectsHelper, Entity, RequestSender, RequestType, SendRequestAction } from './common';
import { catchError, filter, mergeMap } from 'rxjs/operators';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

export function createEffectsHelper<T extends Entity, E>(name: string,
                                                         actionHelper: ActionHelper<T, E>,
                                                         actions$: Actions): EffectsHelper<T> {

  const effect = <R>(requestType: RequestType,
                     requestSender: RequestSender<T, R>,
                     successActions: Observable<Action> = EMPTY,
                     errorActions: Observable<Action> = EMPTY): Observable<Action> => {
    return actions$.pipe(
      filter(action => actionHelper.isSendRequestAction(name, action, requestType)),
      mergeMap((action: SendRequestAction<R>) => requestSender(action.payload).pipe(
        mergeMap(response => merge(of(actionHelper.createSuccessAction(response, action)), successActions)),
        catchError(error => merge(of(actionHelper.createErrorAction(error, action)), errorActions))
      )),
    );
  };

  return {
    listEffect<R>(requestSender: RequestSender<T, R>,
                  successActions?: Observable<Action>,
                  errorActions?: Observable<Action>) {
      return effect(RequestType.LIST, requestSender, successActions, errorActions);
    },

    getEffect<R>(requestSender: RequestSender<T, R>,
                 successActions?: Observable<Action>,
                 errorActions?: Observable<Action>) {
      return effect(RequestType.GET, requestSender, successActions, errorActions);
    },

    createEffect<R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) {
      return effect(RequestType.CREATE, requestSender, successActions, errorActions);
    },

    updateEffect<R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) {
      return effect(RequestType.UPDATE, requestSender, successActions, errorActions);
    },

    deleteEffect<R>(requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) {
      return effect(RequestType.DELETE, requestSender, successActions, errorActions);
    },

    getSingleEffect<R>(requestSender: RequestSender<T, R>,
                       successActions?: Observable<Action>,
                       errorActions?: Observable<Action>) {
      return effect(RequestType.GET_SINGLE, requestSender, successActions, errorActions);
    },

    createSingleEffect<R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) {
      return effect(RequestType.CREATE_SINGLE, requestSender, successActions, errorActions);
    },

    updateSingleEffect<R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) {
      return effect(RequestType.UPDATE_SINGLE, requestSender, successActions, errorActions);
    },

    deleteSingleEffect<R>(requestSender: RequestSender<T, R>,
                          successActions?: Observable<Action>,
                          errorActions?: Observable<Action>) {
      return effect(RequestType.DELETE_SINGLE, requestSender, successActions, errorActions);
    },

    customEffect<R>(requestType: RequestType,
                    requestSender: RequestSender<T, R>,
                    successActions?: Observable<Action>,
                    errorActions?: Observable<Action>) {
      return effect(requestType, requestSender, successActions, errorActions);
    },
  };
}
