import { Injectable } from '@angular/core';
import * as faker from 'faker';
import { from } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v1 as uuid } from 'uuid';
import * as range from 'lodash.range';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  listUsers() {
    const users = range(0, 20).map(() => ({
      id: uuid(),
      ...faker.helpers.userCard(),
    }));
    return from([users]).pipe(
      delay(2000),
    );
  }
}
