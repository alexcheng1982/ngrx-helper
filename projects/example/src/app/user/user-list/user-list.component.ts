import { Component, Inject, OnInit } from '@angular/core';
import { NgRxHelper, RequestType } from '@vividcode/ngrx-helper';
import { Observable } from 'rxjs';
import { UserHelperToken } from '../ngrx-tokens';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$: Observable<any[]>;
  usersLoading$: Observable<boolean>;

  constructor(@Inject(UserHelperToken) private ngRxHelper: NgRxHelper<any, any>) {
    const requestAction = ngRxHelper.action.sendRequestAction(RequestType.LIST);
    this.users$ = ngRxHelper.selector.entitiesSelectAll;
    this.usersLoading$ = ngRxHelper.selector.isActionLoading(requestAction);
  }

  ngOnInit() {

  }

}
