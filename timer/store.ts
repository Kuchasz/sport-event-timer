import players from "./slices/players";
import raceCategories from "./slices/race-categories";
import timeKeepers from "./slices/time-keepers";
import timeStamps from "./slices/time-stamps";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        players,
        timeKeepers,
        timeStamps,
        raceCategories
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
