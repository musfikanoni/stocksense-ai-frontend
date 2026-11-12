"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSession, clearSession, updateUser } from "@/redux/features/user/userSlice";
import type { AuthUser } from "@/redux/type";
export type { AuthUser };

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (u: AuthUser) => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refresh: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.user.user);
  const reduxToken = useAppSelector((state) => state.user.token);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("ss_token");
      const storedUser = localStorage.getItem("ss_user");
      if (storedToken && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          dispatch(setSession({ token: storedToken, user: parsed }));
        } catch {
          // ignore corrupted local storage
        }
      }
    }
    setLoading(false);
  }, [dispatch]);

  const login = useCallback(
    (tok: string, u: AuthUser) => {
      dispatch(setSession({ token: tok, user: u }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(clearSession());
  }, [dispatch]);

  const handleSetUser = useCallback(
    (u: AuthUser) => {
      dispatch(updateUser(u));
    },
    [dispatch]
  );

  const refresh = useCallback(async () => {
    // Redux RTK query getMe can also be dispatched if needed
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: reduxUser,
        token: reduxToken,
        isLoading,
        login,
        logout,
        refresh,
        setUser: handleSetUser,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
