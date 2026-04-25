import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user.slice";
import profileReducer from "./features/profile/profile.slice";
import { injectStore } from "./api"; // ✅ safe — api.ts no longer imports store.ts

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

injectStore(store); // ✅ breaks the circular reference

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;