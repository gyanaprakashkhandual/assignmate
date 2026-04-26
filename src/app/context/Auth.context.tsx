/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { fetchMe, logout, clearUser } from "@/app/lib/features/user/user.slice";
import {
  clearProfile,
  fetchMyProfile,
} from "@/app/lib/features/profile/profile.slice";
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectIsChecked,
} from "@/app/lib/features/user/user.selector";
import { userApi } from "@/app/lib/apis/user.api";
import { IUser } from "@/app/lib/types/user.types";

interface AuthContextValue {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isChecked: boolean;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const isChecked = useAppSelector(selectIsChecked);

  useEffect(() => {
    if (!isChecked) {
      dispatch(fetchMe());
    }
  }, [dispatch, isChecked]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyProfile());
    }
  }, [isAuthenticated]);

  const loginWithGoogle = () => userApi.initiateGoogleAuth();
  const loginWithGithub = () => userApi.initiateGithubAuth();

  const signOut = async () => {
    await dispatch(logout());
    dispatch(clearUser());
    dispatch(clearProfile());
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isChecked,
        loginWithGoogle,
        loginWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
