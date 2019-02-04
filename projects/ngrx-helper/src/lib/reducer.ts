import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {
  isStoreAction,
  RequestErrorAction,
  RequestSuccessAction,
  RequestType,
  StoreAction,
  StoreActionType,
  SymbolRequest,
  SymbolRequestType,
  SymbolStoreActionType,
} from './action';

export interface Entity {
  id: string;
}

export interface ActionStatus<E> {
  action: StoreAction;
  loading?: boolean;
  error?: E;
}

export interface State<T extends Entity, E> {
  entities: EntityState<T>;
  actions: EntityState<ActionStatus<E>>;
}

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
            default: {
              return state;
            }
          }
        case StoreActionType.INTERNAL:
          switch (request[SymbolRequestType]) {
            case RequestType.DELETE:
              return {
                ...state,
                actions: actionsAdapter.removeOne(action.payload.id || action.payload, state.actions),
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

export interface ReducerHelper<T extends Entity, E> {
  reducer: (state: State<T, E>, action: any) => State<T, E>;
  entitiesAdapter: EntityAdapter<T>;
  actionsAdapter: EntityAdapter<ActionStatus<E>>;
}

