import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { StoreModule } from '@ngrx/store';
import { NgRxHelperModule } from '@vividcode/ngrx-helper';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';
import { featureName, UserHelperToken, UserNameToken, UserReducerFunctionToken } from './ngrx-tokens';

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgRxHelperModule.forFeature(featureName, UserNameToken,  UserReducerFunctionToken, UserHelperToken),
    StoreModule.forFeature(featureName, UserReducerFunctionToken),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UserModule {
}
