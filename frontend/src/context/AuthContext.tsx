import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { storageKeys } from "../data/mockData";
import { loginRequest, registerRequest } from "../services/api";
import type { AuthUser, LoginPayload, RegisterPayload } from "../types/app";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(storageKeys.user);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const persistSession = (nextUser: AuthUser, token: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeys.user, JSON.stringify(nextUser));
      window.localStorage.setItem(storageKeys.token, token);
    }

    setUser(nextUser);
  };

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload);
    persistSession(response.user, response.token);
  };

  const register = async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    persistSession(response.user, response.token);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKeys.user);
      window.localStorage.removeItem(storageKeys.token);
    }

    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}