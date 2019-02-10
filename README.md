# NgRx Helper

A helper library to make use of [NgRx](https://ngrx.io/) easier. `ngrx-helper` creates several helper objects to interact with NgRx store.

* Reducer helper: Create the reducer function for NgRx.
* Action helper: Send different actions.
* Effects helper: Create effects to handle different actions.
* Selector helper: Create selectors.

## Usage

### Installation

To use `ngrx-helper`, run `npm` or `yarn` to install the package `@vividcode/ngrx-helper`.

```
$ npm i @vividcode/ngrx-helper
``` 

### Create injection tokens

You need to create three injection tokens for `ngrx-helper` to associate with created helper object.

* For reducer function, used by NgRx and `ngrx-helper`
* For feature name
* For NgRx helper

The code below shows a list of `InjectionToken`s for the feature `user`.

```typescript
import { InjectionToken } from '@angular/core';

export const featureName = 'user';
export const UserReducerFunctionToken = new InjectionToken(`user reducer function`);
export const UserNameToken = new InjectionToken(`user name`);
export const UserHelperToken = new InjectionToken(`user helper`);
```

### Import module

In your own module, use `NgRxHelperModule.forFeature()` to create the module for the feature. `forFeature()` accepts parameters of the feature name, reducer function injection token and an object of other injection tokens.

```typescript
NgRxHelperModule.forFeature(featureName, UserNameToken,  UserReducerFunctionToken, UserHelperToken)
```

Then import the NgRx feature module using `StoreModule.forFeature`. Remember to use the injection token for the reducer function.

```typescript
StoreModule.forFeature(featureName, UserReducerFunctionToken)
```

Now the reducer should work.
