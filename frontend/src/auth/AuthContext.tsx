import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { api, clearToken, saveToken } from "../api/client";
import type { PublicUser, SessionResponse } from "../api/types";

interface AuthState {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api<PublicUser>("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  async function openSession(path: string, body: unknown) {
    const session = await api<SessionResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    saveToken(session.accessToken);
    setUser(session.user);
  }

  const value: AuthState = {
    user,
    ready,
    login: (email, password) => openSession("/api/auth/login", { email, password }),
    register: (fullName, email, password) =>
      openSession("/api/auth/register", { fullName, email, password }),
    logout: () => {
      clearToken();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}

export function useSubmit(action: (event: FormEvent) => Promise<void>) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await action(event);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo completar la acción.");
    } finally {
      setPending(false);
    }
  }

  return { error, pending, onSubmit };
}
