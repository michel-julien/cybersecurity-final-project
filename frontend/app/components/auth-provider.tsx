"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type AuthUser = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
};

const STORAGE_KEY = "peperolife-demo-user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
let cachedUser: AuthUser | null = null;
let hasReadStorage = false;

function readStoredUser(): AuthUser | null {
  try {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    const parsedUser: unknown = JSON.parse(storedUser);

    if (typeof parsedUser !== "object" || parsedUser === null) {
      return null;
    }

    const record = parsedUser as Record<string, unknown>;

    if (typeof record.email !== "string" || typeof record.name !== "string") {
      return null;
    }

    return { email: record.email, name: record.name };
  } catch {
    return null;
  }
}

function getClientSnapshot() {
  if (!hasReadStorage) {
    cachedUser = readStoredUser();
    hasReadStorage = true;
  }

  return cachedUser;
}

function getServerSnapshot() {
  return null;
}

function subscribeToAuth(callback: () => void) {
  function handleAuthChange() {
    cachedUser = readStoredUser();
    callback();
  }

  window.addEventListener("storage", handleAuthChange);
  window.addEventListener("peperolife-auth-change", handleAuthChange);

  return () => {
    window.removeEventListener("storage", handleAuthChange);
    window.removeEventListener("peperolife-auth-change", handleAuthChange);
  };
}

function nameFromEmail(email: string) {
  const emailName = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();

  if (!emailName) {
    return "Pepero friend";
  }

  return emailName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(
    subscribeToAuth,
    getClientSnapshot,
    getServerSnapshot,
  );

  function signIn(email: string, name?: string) {
    const nextUser: AuthUser = {
      email,
      name: name?.trim() || nameFromEmail(email),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    cachedUser = nextUser;
    window.dispatchEvent(new Event("peperolife-auth-change"));
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedUser = null;
    window.dispatchEvent(new Event("peperolife-auth-change"));
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
