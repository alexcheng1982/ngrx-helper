import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { createReducerHelper } from './reducer';
import { ActionReducer, Store } from '@ngrx/store';
import { createActionHelper } from './action';
import { Actions } from '@ngrx/effects';
import { createEffectsHelper } from './effects';
import { createSelectorHelper } from './selector';
import { Entity, NgRxHelper, State } from './common';

export function reducerFactory<T extends Entity, E>(ngRxHelper: NgRxHelper<T, E>): (state: State<T, E>, action: any) => State<T, E> {
  return ngRxHelper.reducer.reducer;
}

export function createHelper<T extends Entity, E>(name: string, store: Store<any>, action$: Actions): NgRxHelper<T, E> {
  const reducerHelper = createReducerHelper<T, E>(name);
  const actionHelper = createActionHelper<T, E>(name, store);
  const effectsHelper = createEffectsHelper(name, actionHelper, action$);
  const selectorHelper = createSelectorHelper(name, reducerHelper, store);
  return {
    reducer: reducerHelper,
    action: actionHelper,
    effects: effectsHelper,
    selector: selectorHelper,
  };
}

@NgModule()
export class NgRxHelperModule {
  static forFeature<T extends Entity, E>(name: string,
                                         nameToken: InjectionToken<string>,
                                         reducerToken: InjectionToken<ActionReducer<any, any>>,
                                         helperToken: InjectionToken<NgRxHelper<any, any>>): ModuleWithProviders {
    return {
      ngModule: NgRxHelperModule,
      providers: [
        {
          provide: nameToken,
          useValue: name,
        },
        {
          provide: helperToken,
          useFactory: createHelper,
          deps: [
            nameToken,
            Store,
            Actions,
          ],
        },
        {
          provide: reducerToken,
          useFactory: reducerFactory,
          deps: [
            helperToken,
          ],
        },
      ],
    };
  }
}
