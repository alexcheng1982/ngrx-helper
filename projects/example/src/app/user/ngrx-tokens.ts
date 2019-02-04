import { InjectionToken } from '@angular/core';

export const featureName = 'user';

export const UserTokenName = new InjectionToken<string>(`user name`);
export const UserTokenAction = new InjectionToken<string>(`user action`);
export const UserTokenReducer = new InjectionToken<string>(`user reducer`);
export const UserTokenEffect = new InjectionToken<string>(`user effects`);
export const UserTokenSelector = new InjectionToken<string>(`user selector`);
