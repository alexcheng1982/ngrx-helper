import { Inject, Injectable } from '@angular/core';
import { NgRxHelper } from '@vividcode/ngrx-helper';
import { UserService } from './user.service';
import { Effect } from '@ngrx/effects';
import { UserHelperToken } from './ngrx-tokens';

@Injectable()
export class UserEffects {
  constructor(@Inject(UserHelperToken) private ngRxHelper: NgRxHelper<any, any>,
              private userService: UserService) {
  }

  @Effect()
  loadUser$ = this.ngRxHelper.effects.listEffect(() => this.userService.listUsers());
}
