"use client";
import { InputProvider } from "@/ui/inputs/inputs/Input.context";
import { ButtonProvider } from "@/ui/inputs/button/Button.context";
import { SidebarProvider } from "@/ui/navigations/sidebar/Sidebar.context";
import AuthenticatedLayout from "@/app/layouts/Authenticate.layout";
import { ThemeProvider } from "@/app/context/Theme.context";
import { ActionMenuProvider } from "@/ui/navigations/action/Action.menu.context";
import { SkeletonProvider } from "@/ui/feedback/skeleton/Skeleton.context";
import { ConfirmProvider } from "@/ui/overlay/confirm/Confirm.context";
import { AlertProvider } from "@/ui/feedback/alert/Alert.context";
import { SnackbarProvider } from "@/ui/feedback/snackbar/Snackbar.context";

import { AuthProvider } from "@/app/context/Auth.context";
import { OnboardProvider } from "@/app/context/Onboard.context";

import { Provider } from "react-redux";
import { store } from "../../lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <AlertProvider>
          <ConfirmProvider>
            <SkeletonProvider>
              <ActionMenuProvider>
                <SidebarProvider>
                  <ButtonProvider>
                    <InputProvider>
                      <OnboardProvider>
                        <AuthProvider>
                          <ThemeProvider>
                            <AuthenticatedLayout>
                              {children}
                            </AuthenticatedLayout>
                          </ThemeProvider>
                        </AuthProvider>
                      </OnboardProvider>
                    </InputProvider>
                  </ButtonProvider>
                </SidebarProvider>
              </ActionMenuProvider>
            </SkeletonProvider>
          </ConfirmProvider>
        </AlertProvider>
      </SnackbarProvider>
    </Provider>
  );
}
