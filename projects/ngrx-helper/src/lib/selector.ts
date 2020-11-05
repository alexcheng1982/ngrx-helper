import {
  ActionStatus,
  Entity,
  ReducerHelper,
  RequestType,
  SelectorHelper, SINGLE_ITEM_ID,
  State,
  StoreActionType,
  SymbolRequestType,
  SymbolStoreActionType
} from './common';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import get from 'lodash.get';
import some from 'lodash.some';

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

  const selectActionStatusAll = createSelector(
    actionsSelector,
    reducerHelper.actionsAdapter.getSelectors().selectAll,
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

  const entitiesSelectSingleSelector = createSelector(
    entitiesSelectEntitiesSelector,
    entities => get(entities, SINGLE_ITEM_ID, null),
  );

  const isActionLoadingSelector = (action: any) => createSelector(
    selectActionStatus,
    status => get(status, [action.id, 'loading'], false),
  );

  const actionErrorSelector = (action: any) => createSelector(
    selectActionStatus,
    status => get(status, [action.id, 'error'], null),
  );

  const hasPendingActionsSelector = (type: RequestType) => createSelector(
    selectActionStatusAll,
    statuses => some(statuses, (status: ActionStatus<any>) =>
      status.action[SymbolStoreActionType] === StoreActionType.REQUEST && status.action[SymbolRequestType] === type
    )
  );

  return {
    entitiesSelectAllSelector,
    entitiesSelectEntitiesSelector,
    entitiesSelectIdsSelector,
    entitiesSelectTotalSelector,
    entitiesSelectSingleSelector,
    isActionLoadingSelector,
    actionErrorSelector,
    hasPendingActionsSelector,
    entitiesSelectAll: store.pipe(select(entitiesSelectAllSelector)),
    entitiesSelectEntities: store.pipe(select(entitiesSelectEntitiesSelector)),
    entitiesSelectIds: store.pipe(select(entitiesSelectIdsSelector)),
    entitiesSelectTotal: store.pipe(select(entitiesSelectTotalSelector)),
    entitiesSelectSingle: store.pipe(select(entitiesSelectSingleSelector)),
    isActionLoading: (action: any) => store.pipe(select(isActionLoadingSelector(action))),
    actionError: (action: any) => store.pipe(select(actionErrorSelector(action))),
    hasPendingActions: (type: RequestType) => store.pipe(select(hasPendingActionsSelector(type))),
  };
}
