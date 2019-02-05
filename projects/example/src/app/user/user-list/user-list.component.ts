import { Component, Inject, OnInit } from '@angular/core';
import { ActionHelper, RequestType, SelectorHelper } from '@vividcode/ngrx-helper';
import { Observable } from 'rxjs';
import { UserSelectorToken, UserActionToken } from '../ngrx-tokens';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$: Observable<any[]>;
  usersLoading$: Observable<boolean>;

  constructor(@Inject(UserSelectorToken) private selectorHelper: SelectorHelper<any, any>,
              @Inject(UserActionToken) private actionHelper: ActionHelper<any, any>) {
    const requestAction = this.actionHelper.sendRequestAction(RequestType.LIST);
    this.users$ = selectorHelper.entitiesSelectAll;
    this.usersLoading$ = selectorHelper.isActionLoading(requestAction);
  }

  ngOnInit() {

  }

}
