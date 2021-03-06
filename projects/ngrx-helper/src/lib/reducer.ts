import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  Entity,
  isStoreAction,
  RequestErrorAction,
  RequestSuccessAction,
  RequestType,
  StoreAction,
  StoreActionType,
  SymbolRequest,
  SymbolRequestType,
  SymbolStoreActionType,
  ReducerHelper,
  ActionStatus,
  State, SINGLE_ITEM_ID,
} from './common';


export function createReducerHelper<T extends Entity, E>(name: string): ReducerHelper<T, E> {
  const entitiesAdapter = createEntityAdapter<T>({
    selectId: model => model.id,
  });
  const initialEntitiesState: EntityState<T> = entitiesAdapter.getInitialState();

  const actionsAdapter = createEntityAdapter<ActionStatus<E>>({
    selectId: model => model.action.id,
  });

  const initialActionsState: EntityState<ActionStatus<E>> = actionsAdapter.getInitialState();

  const initialState: State<T, E> = {
    entities: initialEntitiesState,
    actions: initialActionsState,
  };

  return {
    entitiesAdapter,
    actionsAdapter,
    reducer: (state = initialState, action: any) => {
      if (!isStoreAction(name, action)) {
        return state;
      }
      const storeAction = action as StoreAction;
      switch (storeAction[SymbolStoreActionType]) {
        case StoreActionType.REQUEST:
          return {
            ...state,
            actions: actionsAdapter.addOne({
              action: storeAction,
              loading: true,
              error: null,
            }, state.actions)
          };
        case StoreActionType.ERROR:
          return {
            ...state,
            actions: actionsAdapter.updateOne({
              id: storeAction.id,
              changes: {
                loading: false,
                error: (storeAction as RequestErrorAction<any, E>).payload,
              },
            }, state.actions),
          };
        case StoreActionType.SUCCESS:
          const {payload, [SymbolRequest]: request} = storeAction as RequestSuccessAction<T, any>;
          const actions = actionsAdapter.removeOne(request.id, state.actions);
          switch (request[SymbolRequestType]) {
            case RequestType.LIST:
              return {
                entities: entitiesAdapter.upsertMany(payload as T[], state.entities),
                actions,
              };
            case RequestType.GET:
            case RequestType.UPDATE:
            case RequestType.CREATE: {
              return {
                entities: entitiesAdapter.upsertOne(payload as T, state.entities),
                actions,
              };
            }
            case RequestType.DELETE: {
              return {
                entities: entitiesAdapter.removeOne(payload as string, state.entities),
                actions,
              };
            }
            case RequestType.GET_SINGLE:
            case RequestType.UPDATE_SINGLE:
            case RequestType.CREATE_SINGLE:
              return {
                entities: entitiesAdapter.upsertOne({
                  ...(payload as T),
                  id: SINGLE_ITEM_ID,
                }, state.entities),
                actions,
              };
            case RequestType.DELETE_SINGLE:
              return {
                entities: entitiesAdapter.removeOne(SINGLE_ITEM_ID, state.entities),
                actions,
              };
            default: {
              return {
                ...state,
                actions,
              };
            }
          }
        case StoreActionType.INTERNAL:
          switch (storeAction[SymbolRequestType]) {
            case RequestType.CLEAR_ACTION:
              return {
                ...state,
                actions: actionsAdapter.removeOne(action.payload.id || action.payload, state.actions),
              };
            case RequestType.CLEAR_DATA:
              return {
                ...state,
                entities: entitiesAdapter.removeAll(state.entities),
              };
            default: {
              return state;
            }
          }

        default: {
          return state;
        }
      }
    }
  };
}
