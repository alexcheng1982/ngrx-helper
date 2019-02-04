import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { StoreModule } from '@ngrx/store';
import { NgRxHelperModule } from '@vividcode/ngrx-helper';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import {
  featureName,
  UserTokenAction,
  UserTokenEffect,
  UserTokenName,
  UserTokenReducer,
  UserTokenSelector
} from './ngrx-tokens';

export const reducerToken = new InjectionToken('reducer');


@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgRxHelperModule.forFeature(featureName, reducerToken, {
      name: UserTokenName,
      action: UserTokenAction,
      effects: UserTokenEffect,
      reducer: UserTokenReducer,
      selector: UserTokenSelector,
    }),
    StoreModule.forFeature(featureName, reducerToken),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UserModule {
}
