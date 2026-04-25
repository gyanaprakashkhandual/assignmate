// src/app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/app/lib/store";
import { AuthProvider } from "@/app/context/Auth.context";
import { ReactNode } from "react";
import { SidebarProvider } from "@/ui/sidebar/Sidebar.context";
import { ConfirmProvider } from "@/ui/confirm/Confirm.contex";
import { NavbarProvider } from "@/ui/navbar/Navbar.ui";
import { ButtonProvider } from "@/ui/button/Button.context";
import { AlertProvider } from "@/ui/alert/Alert.context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <ConfirmProvider>
          <NavbarProvider>
            <ButtonProvider>
              <AlertProvider>
                <AuthProvider>{children}</AuthProvider>
              </AlertProvider>
            </ButtonProvider>
          </NavbarProvider>
        </ConfirmProvider>
      </SidebarProvider>
    </Provider>
  );
}
