import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ReducerHelper, reducerHelperFactory } from './reducer';
import { Store, StoreModule } from '@ngrx/store';
import { actionHelperFactory } from './action';
import { Actions } from '@ngrx/effects';
import { effectsHelperFactory } from './effects';
import { selectorHelperFactory } from './selector';

export interface Tokens {
  action: InjectionToken<any>;
  reducer: InjectionToken<ReducerHelper<any, any>>;
  effects: InjectionToken<any>;
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
    const actionHelper = actionHelperFactory(name);
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
          useValue: actionHelper,
        },
        {
          provide: tokens.effects,
          useFactory: (action$: Actions) => effectsHelperFactory(name, actionHelper, action$),
          deps: [
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
