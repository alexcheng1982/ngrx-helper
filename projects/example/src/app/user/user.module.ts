import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { StoreModule } from '@ngrx/store';
import { NgRxHelperModule } from '@vividcode/ngrx-helper';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import {
  featureName,
  UserActionToken,
  UserEffectsToken,
  UserNameToken,
  UserReducerFunctionToken,
  UserReducerToken,
  UserSelectorToken
} from './ngrx-tokens';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgRxHelperModule.forFeature(featureName, UserReducerFunctionToken, {
      name: UserNameToken,
      action: UserActionToken,
      effects: UserEffectsToken,
      reducer: UserReducerToken,
      selector: UserSelectorToken,
    }),
    StoreModule.forFeature(featureName, UserReducerFunctionToken),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UserModule {
}
