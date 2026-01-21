import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("user_email")
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("user_email");
    if (savedToken) setToken(savedToken);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const login = (newToken: string, newEmail: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user_email", newEmail);
    setToken(newToken);
    setEmail(newEmail);

    // Add to known accounts
    const knownAccounts = JSON.parse(localStorage.getItem("known_accounts") || "[]");
    if (!knownAccounts.some((acc: any) => acc.email === newEmail)) {
      knownAccounts.push({ email: newEmail, name: newEmail.split('@')[0] }); // Fallback name
      localStorage.setItem("known_accounts", JSON.stringify(knownAccounts));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
