import actionsHistory from "./slices/actions-history";
import players from "./slices/players";
import raceCategories from "./slices/race-categories";
import timeKeeperConfig from "./slices/time-keeper-config";
import timeKeepers from "./slices/time-keepers";
import timeStamps from "./slices/time-stamps";
import userConfig from "./slices/user-config";
import {
    AnyAction,
    combineReducers,
    configureStore,
    Middleware
    } from "@reduxjs/toolkit";

const reducer = combineReducers({
    players,
    timeKeepers,
    timeStamps,
    raceCategories,
    actionsHistory,
    timeKeeperConfig,
    userConfig
});

const resettableRootReducer = (state: TimerState, action: AnyAction) => {
    if (action.type === "REPLACE_STATE") {
        return {
            ...action.state,
            timeKeeperConfig: state.timeKeeperConfig,
            userConfig: state.userConfig
        } as TimerState;
    }
    return reducer(state, action) as TimerState;
};

export const createStore = (
    middlewares: Middleware<{}, TimerState, TimerDispatch>[],
    preloadedState?: Partial<TimerState>
) =>
    configureStore({
        reducer: resettableRootReducer as any,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
        preloadedState
    });

//store created only for typechecking
const store = configureStore({
    reducer
});

// Infer the `TimerState` and `TimerDispatch` types from the store itself
export type TimerState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type TimerDispatch = typeof store.dispatch;
