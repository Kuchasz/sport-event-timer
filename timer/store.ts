import players from "./slices/players";
import raceCategories from "./slices/race-categories";
import timeKeepers from "./slices/time-keepers";
import timeStamps from "./slices/time-stamps";
import {
    AnyAction,
    combineReducers,
    configureStore,
    Middleware
    } from "@reduxjs/toolkit";

const reducer = combineReducers({ players, timeKeepers, timeStamps, raceCategories });

const resettableRootReducer = (state: RootState, action: AnyAction) => {
    if (action.type === "REPLACE_STATE") {
        return action.state as RootState;
    }
    return reducer(state, action) as RootState;
};

export const createStore = (middlewares: Middleware<{}, RootState, AppDispatch>[]) =>
    configureStore({
        reducer: resettableRootReducer as any,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
    });

//store created only for typechecking
const store = configureStore({
    reducer
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
