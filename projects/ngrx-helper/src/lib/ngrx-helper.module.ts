import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {createReducerHelper, Entity, ReducerHelper} from './reducer';
import {Store, StoreModule} from '@ngrx/store';
import {ActionHelper, createActionHelper} from './action';
import {Actions} from '@ngrx/effects';
import {createEffectsHelper, EffectsHelper} from './effects';
import {createSelectorHelper} from './selector';

export interface Tokens<T extends Entity, E> {
  name: InjectionToken<string>;
  action: InjectionToken<ActionHelper<T, E>>;
  reducer: InjectionToken<ReducerHelper<T, E>>;
  effects: InjectionToken<EffectsHelper<T>>;
  selector: InjectionToken<any>;
}

export function reducerHelperFactory(name: string) {
  return createReducerHelper(name);
}

export function actionHelperFactory(name: string, store: Store<any>) {
  return createActionHelper(name, store);
}

export function effectsHelperFactory<T, E>(name: string, actionHelper: ActionHelper<T, E>, action$: Actions) {
  return createEffectsHelper(name, actionHelper, action$);
}

export function selectorHelperFactory(name: string, store: Store<any>, reducerHelper) {
  return createSelectorHelper(name, reducerHelper, store);
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: []
})
export class NgrxHelperModule {
  static forFeature<T extends Entity, E>(name: string, tokens: Tokens<T, E>): ModuleWithProviders {
    const reducerHelper = reducerHelperFactory(name);
    const storeModuleProviders = StoreModule.forFeature(name, reducerHelper.reducer);
    return {
      ngModule: storeModuleProviders.ngModule,
      providers: [
        {
          provide: tokens.name,
          useValue: name,
        },
        {
          provide: tokens.reducer,
          useValue: reducerHelper,
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
