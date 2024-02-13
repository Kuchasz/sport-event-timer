import actionsHistory from "./slices/actions-history";
import splitTimes from "./slices/split-times";
import absences from "./slices/absences";
import type { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";

const reducer = combineReducers({
    splitTimes,
    actionsHistory,
    absences,
});

const resettableRootReducer = (state: TimerState, action: UnknownAction) => {
    if (replaceState.match(action))
        return {
            ...action.payload,
        } as TimerState;

    return reducer(state, action);
};

export const createStore = (middlewares: Middleware<object, TimerState, TimerDispatch>[], preloadedState?: Partial<TimerState>) =>
    configureStore({
        reducer: resettableRootReducer as any,
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
        preloadedState,
    });

//store created only for typechecking
const store = configureStore({
    reducer,
});

export const replaceState = createAction("root.replaceState", (state: TimerState) => ({
    payload: state,
    meta: {
        remote: true,
    },
}));

// Infer the `TimerState` and `TimerDispatch` types from the store itself
export type TimerState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type TimerDispatch = typeof store.dispatch;
