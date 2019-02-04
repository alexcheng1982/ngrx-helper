import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { createReducerHelper } from './reducer';
import { ActionReducer, Store } from '@ngrx/store';
import { createActionHelper } from './action';
import { Actions } from '@ngrx/effects';
import { createEffectsHelper } from './effects';
import { createSelectorHelper } from './selector';
import { ActionHelper, Entity, ReducerHelper, EffectsHelper, SelectorHelper, Tokens, State } from './common';

export function reducerHelperFactory(name: string) {
  return createReducerHelper(name);
}

export function reducerFactory<T extends Entity, E>(reducerHelper: ReducerHelper<T, E>): (state: State<T, E>, action: any) => State<T, E> {
  return reducerHelper.reducer;
}

export function actionHelperFactory<T, E>(name: string, store: Store<any>): ActionHelper<T, E> {
  return createActionHelper(name, store);
}

export function effectsHelperFactory<T, E>(name: string, actionHelper: ActionHelper<T, E>, action$: Actions): EffectsHelper<T> {
  return createEffectsHelper(name, actionHelper, action$);
}

export function selectorHelperFactory<T extends Entity, E>(name: string,
                                                           store: Store<any>,
                                                           reducerHelper: ReducerHelper<T, E>): SelectorHelper<T, E> {
  return createSelectorHelper(name, reducerHelper, store);
}

@NgModule()
export class NgRxHelperModule {
  static forFeature<T extends Entity, E>(name: string,
                                         reducerToken: InjectionToken<ActionReducer<any, any>>,
                                         tokens: Tokens<T, E>): ModuleWithProviders {
    return {
      ngModule: NgRxHelperModule,
      providers: [
        {
          provide: tokens.name,
          useValue: name,
        },
        {
          provide: tokens.reducer,
          useFactory: reducerHelperFactory,
          deps: [
            tokens.name
          ],
        },
        {
          provide: reducerToken,
          useFactory: reducerFactory,
          deps: [
            tokens.reducer,
          ],
        },
        {
          provide: tokens.action,
          useFactory: actionHelperFactory,
          deps: [
            tokens.name,
            Store,
          ],
        },
        {
          provide: tokens.effects,
          useFactory: effectsHelperFactory,
          deps: [
            tokens.name,
            tokens.action,
            Actions,
          ],
        },
        {
          provide: tokens.selector,
          useFactory: selectorHelperFactory,
          deps: [
            tokens.name,
            Store,
            tokens.reducer,
          ],
        }
      ],
    };
  }
}
