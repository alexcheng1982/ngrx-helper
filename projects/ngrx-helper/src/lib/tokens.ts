import {Tokens} from './ngrx-helper.module';
import {ActionHelper} from './action';
import {InjectionToken} from '@angular/core';
import {Entity, ReducerHelper} from './reducer';
import {EffectsHelper} from './effects';
import {SelectorHelper} from './selector';

export function createTokens<T extends Entity, E>(name: string): Tokens {
  return {
    action: new InjectionToken<ActionHelper>(`${name} action`),
    reducer: new InjectionToken<ReducerHelper<any, any>>(`${name} reducer`),
    effects: new InjectionToken<EffectsHelper>(`${name} effects`),
    selector: new InjectionToken<SelectorHelper<T, E>>(`${name} selector`),
  };
}
