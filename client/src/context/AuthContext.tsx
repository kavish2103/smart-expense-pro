import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  email: string | null;
  name: string | null;
  login: (token: string, email: string, name?: string | null) => void;
  logout: () => void;
  updateUser: (name: string, email: string) => void;

};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("user_email")
  );
  const [name, setName] = useState<string | null>(
    localStorage.getItem("user_name")
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("user_email");
    const savedName = localStorage.getItem("user_name");
    if (savedToken) setToken(savedToken);
    if (savedEmail) setEmail(savedEmail);
    if (savedName) setName(savedName);
  }, []);

  const login = (newToken: string, newEmail: string, newName?: string | null) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user_email", newEmail);
    if (newName) localStorage.setItem("user_name", newName);

    setToken(newToken);
    setEmail(newEmail);
    if (newName) setName(newName);

    // Add to known accounts
    const knownAccounts = JSON.parse(localStorage.getItem("known_accounts") || "[]");
    if (!knownAccounts.some((acc: any) => acc.email === newEmail)) {
      knownAccounts.push({ email: newEmail, name: newName || newEmail.split('@')[0] });
      localStorage.setItem("known_accounts", JSON.stringify(knownAccounts));
    }
  };

  const updateUser = (newName: string, newEmail: string) => {
    setEmail(newEmail);
    setName(newName);
    localStorage.setItem("user_email", newEmail);
    localStorage.setItem("user_name", newName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    setToken(null);
    setEmail(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, name, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
