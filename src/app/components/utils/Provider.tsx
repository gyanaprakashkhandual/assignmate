"use client";

import { AuthProvider } from "@/app/context/Auth.context";
import { InputProvider } from "@/ui/inputs/inputs/Input.context";
import { CardProvider } from "@/ui/data/card/Card.context";
import { ButtonProvider } from "@/ui/inputs/button/Button.context";
import { SidebarProvider } from "@/ui/navigations/sidebar/Sidebar.context";
import AuthenticatedLayout from "@/app/layouts/Authenticate.layout";
import { TabsProvider } from "@/ui/navigations/tab/Tab.context";
import { ToggleProvider } from "@/ui/inputs/toggle/Toogle.context";
import { ThemeProvider } from "@/app/context/Theme.contex";
import { ActionMenuProvider } from "@/ui/navigations/action/Action.menu.context";
import { NavbarProvider } from "@/ui/navigations/navbar/Navbar.context";
import { ListProvider } from "@/ui/data/list/List.context";
import { TableProvider } from "@/ui/data/table/Table.context";
import { Provider } from "react-redux";
import { store } from "../../lib/store";
import { SkeletonProvider } from "@/ui/feedback/skeleton/Skeleton.context";
import { ConfirmProvider } from "@/ui/overlay/confirm/Confirm.context";
import { DateTimeProvider } from "@/ui/inputs/time/Time.context";
import { WindowProvider } from "@/ui/overlay/window/Window.context";

import { AlertProvider } from "@/ui/feedback/alert/Alert.context";
import { SnackbarProvider } from "@/ui/feedback/snackbar/Snackbar.context";
import { OnboardProvider } from "@/app/context/Onboard.context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <AlertProvider>
          <WindowProvider>
            <DateTimeProvider>
              <ConfirmProvider>
                <SkeletonProvider>
                  <TableProvider children={undefined} columns={[]} data={[]}>
                    <ListProvider children={undefined} items={[]}>
                      <NavbarProvider>
                        <ActionMenuProvider>
                          <ToggleProvider>
                            <TabsProvider children={undefined} defaultActiveId={""}>
                              <SidebarProvider>
                                <ButtonProvider>
                                  <InputProvider>
                                    <CardProvider>
                                      <OnboardProvider>
                                      <AuthProvider>
                                        <ThemeProvider>
                                          <AuthenticatedLayout>
                                          {children}
                                          </AuthenticatedLayout>
                                        </ThemeProvider>
                                      </AuthProvider>
                                      </OnboardProvider>
                                    </CardProvider>
                                  </InputProvider>
                                </ButtonProvider>
                              </SidebarProvider>
                            </TabsProvider>
                          </ToggleProvider>
                        </ActionMenuProvider>
                      </NavbarProvider>
                    </ListProvider>
                  </TableProvider>
                </SkeletonProvider>
              </ConfirmProvider>
            </DateTimeProvider>
          </WindowProvider>
        </AlertProvider>
      </SnackbarProvider>
    </Provider>
  );
}
