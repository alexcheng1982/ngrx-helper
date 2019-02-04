import {Entity, ReducerHelper, State} from './reducer';
import {createFeatureSelector, createSelector, select, Selector, Store} from '@ngrx/store';
import {Dictionary} from '@ngrx/entity';
import {Observable} from 'rxjs';

export function createSelectorHelper<T extends Entity, E>(name: string,
                                                          reducerHelper: ReducerHelper<T, E>,
                                                          store: Store<any>): SelectorHelper<T, E> {
  const featureSelector = createFeatureSelector<State<T, E>>(name);
  const entitiesSelector = createSelector(
    featureSelector,
    state => state.entities,
  );
  const actionsSelector = createSelector(
    featureSelector,
    state => state.actions,
  );
  const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,
  } = reducerHelper.entitiesAdapter.getSelectors();
  const selectActionStatus = createSelector(
    actionsSelector,
    reducerHelper.actionsAdapter.getSelectors().selectEntities,
  );

  const entitiesSelectAllSelector = createSelector(
    entitiesSelector,
    selectAll,
  );

  const entitiesSelectEntitiesSelector = createSelector(
    entitiesSelector,
    selectEntities,
  );

  const entitiesSelectIdsSelector = createSelector(
    entitiesSelector,
    selectIds,
  );

  const entitiesSelectTotalSelector = createSelector(
    entitiesSelector,
    selectTotal,
  );

  const isActionLoadingSelector = (action: any) => createSelector(
    selectActionStatus,
    status => status[action.id] && status[action.id].loading,
  );
  const actionErrorSelector = (action: any) => createSelector(
    selectActionStatus,
    status => status[action.id] && status[action.id].error,
  );
  return {
    entitiesSelectAllSelector,
    entitiesSelectEntitiesSelector,
    entitiesSelectIdsSelector,
    entitiesSelectTotalSelector,
    isActionLoadingSelector,
    actionErrorSelector,
    entitiesSelectAll: store.pipe(select(entitiesSelectAllSelector)),
    entitiesSelectEntities: store.pipe(select(entitiesSelectEntitiesSelector)),
    entitiesSelectIds: store.pipe(select(entitiesSelectIdsSelector)),
    entitiesSelectTotal: store.pipe(select(entitiesSelectTotalSelector)),
    isActionLoading: (action: any) => store.pipe(select(isActionLoadingSelector(action))),
    actionError: (action: any) => store.pipe(select(actionErrorSelector(action))),
  };
}

export interface SelectorHelper<T extends Entity, E> {
  entitiesSelectAllSelector: Selector<State<T, E>, T[]>;
  entitiesSelectEntitiesSelector: Selector<State<T, E>, Dictionary<T>>;
  entitiesSelectIdsSelector: Selector<State<T, E>, number[] | string[]>;
  entitiesSelectTotalSelector: Selector<State<T, E>, number>;
  isActionLoadingSelector: (any) => Selector<State<T, E>, boolean>;
  actionErrorSelector: (any) => Selector<State<T, E>, E>;
  entitiesSelectAll: Observable<T[]>;
  entitiesSelectEntities: Observable<Dictionary<T>>;
  entitiesSelectIds: Observable<number[] | string[]>;
  entitiesSelectTotal: Observable<number>;
  isActionLoading: (any) => Observable<boolean>;
  actionError: (action) => Observable<E>;
}
