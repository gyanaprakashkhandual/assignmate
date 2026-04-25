// src/app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/app/lib/store";
import { AuthProvider } from "@/app/context/Auth.context";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Provider>
    );
}