/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAppSelector } from "@/app/lib/hooks";
import {
  selectHasProfile,
  selectProfileFetched,
} from "@/app/lib/features/profile/profile.selector";
import {
  selectIsAuthenticated,
  selectIsChecked,
} from "@/app/lib/features/user/user.selector";

interface OnboardContextValue {
  isOnboarded: boolean;
  isChecking: boolean;
  markOnboarded: () => void;
}

const OnboardContext = createContext<OnboardContextValue | null>(null);

export function OnboardProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isChecked = useAppSelector(selectIsChecked);
  const hasProfile = useAppSelector(selectHasProfile);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const isProfileFetched = useAppSelector(selectProfileFetched);

  useEffect(() => {
    if (!isChecked) return;
    if (!isAuthenticated) {
      setIsChecking(false);
      return;
    }
    if (!isProfileFetched) return;
    setIsOnboarded(hasProfile);
    setIsChecking(false);
  }, [isChecked, isAuthenticated, hasProfile, isProfileFetched]);
  const markOnboarded = () => setIsOnboarded(true);

  return (
    <OnboardContext.Provider value={{ isOnboarded, isChecking, markOnboarded }}>
      {children}
    </OnboardContext.Provider>
  );
}

export function useOnboard(): OnboardContextValue {
  const ctx = useContext(OnboardContext);
  if (!ctx) throw new Error("useOnboard must be used inside OnboardProvider");
  return ctx;
}
