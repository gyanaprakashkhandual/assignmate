import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user.slice";
import profileReducer from "./features/profile/profile.slice";
import { injectStore } from "./api";

export const store = configureStore({
    reducer: {
        auth: userReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "auth/fetchMe/fulfilled",
                    "profile/uploadHandwritingImage/pending"
                ],
            },
        }),
    devTools: process.env.NODE_ENV !== "production",
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;