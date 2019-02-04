import {Tokens} from './ngrx-helper.module';
import {ActionHelper} from './action';
import {InjectionToken} from '@angular/core';
import {Entity, ReducerHelper} from './reducer';
import {EffectsHelper} from './effects';
import {SelectorHelper} from './selector';

export function createTokens<T extends Entity, E>(name: string): Tokens<T, E> {
  return {
    name: new InjectionToken<string>(`${name} name`),
    action: new InjectionToken<ActionHelper<T, E>>(`${name} action`),
    reducer: new InjectionToken<ReducerHelper<any, any>>(`${name} reducer`),
    effects: new InjectionToken<EffectsHelper<T>>(`${name} effects`),
    selector: new InjectionToken<SelectorHelper<T, E>>(`${name} selector`),
  };
}
