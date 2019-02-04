import { InjectionToken } from '@angular/core';

export const featureName = 'user';

export const UserTokenName = new InjectionToken<string>(`user name`);
export const UserTokenAction = new InjectionToken<any>(`user action`);
export const UserTokenReducer = new InjectionToken<any>(`user reducer`);
export const UserTokenEffects = new InjectionToken<any>(`user effects`);
export const UserTokenSelector = new InjectionToken<any>(`user selector`);
