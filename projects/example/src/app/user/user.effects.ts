import { Inject, Injectable } from '@angular/core';
import { EffectsHelper } from '@vividcode/ngrx-helper';
import { UserService } from './user.service';
import { Effect } from '@ngrx/effects';
import { UserEffectsToken } from './ngrx-tokens';

@Injectable()
export class UserEffects {
  constructor(@Inject(UserEffectsToken) private effectsHelper: EffectsHelper<any>,
              private userService: UserService) {
  }

  @Effect()
  loadUser$ = this.effectsHelper.listEffect(() => this.userService.listUsers());
}
