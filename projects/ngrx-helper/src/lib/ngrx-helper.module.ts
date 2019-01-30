import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ReducerHelper, reducerHelperFactory } from './reducer';
import { Store, StoreModule } from '@ngrx/store';
import { actionHelperFactory, ActionHelper } from './action';
import { Actions } from '@ngrx/effects';
import { effectsHelperFactory, EffectsHelper } from './effects';
import { selectorHelperFactory } from './selector';

export interface Tokens {
  action: InjectionToken<ActionHelper>;
  reducer: InjectionToken<ReducerHelper<any, any>>;
  effects: InjectionToken<EffectsHelper>;
  selector: InjectionToken<any>;
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: []
})
export class NgrxHelperModule {
  static forFeature(name: string, tokens: Tokens): ModuleWithProviders {
    const reducerHelper = reducerHelperFactory(name);
    const storeModuleProviders = StoreModule.forFeature(name, reducerHelper.reducer);
    return {
      ngModule: storeModuleProviders.ngModule,
      providers: [
        ...storeModuleProviders.providers,
        {
          provide: tokens.reducer,
          useValue: reducerHelper,
        },
        {
          provide: tokens.action,
          useFactory: store => actionHelperFactory(name, store),
          deps: [
            Store,
          ],
        },
        {
          provide: tokens.effects,
          useFactory: (actionHelper, action$: Actions) => effectsHelperFactory(name, actionHelper, action$),
          deps: [
            tokens.action,
            Actions,
          ],
        },
        {
          provide: tokens.selector,
          useFactory: store => selectorHelperFactory(name, reducerHelper, store),
          deps: [
            Store,
          ],
        }
      ],
    };
  }
}
