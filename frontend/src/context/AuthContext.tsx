import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export type UserRole = "citizen" | "responder";

interface User {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("rescuenet_auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("rescuenet_auth");
        localStorage.removeItem("rescuenet_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Enforce selected role matching (or auto-assign database role)
      const newUser = { email: data.user.email, role: data.user.role as UserRole };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("rescuenet_auth", JSON.stringify(newUser));
      localStorage.setItem("rescuenet_token", data.token);
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to log in.");
      return false;
    }
  };

  const signup = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const newUser = { email: data.user.email, role: data.user.role as UserRole };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("rescuenet_auth", JSON.stringify(newUser));
      localStorage.setItem("rescuenet_token", data.token);
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to register.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("rescuenet_auth");
    localStorage.removeItem("rescuenet_token");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#f3f4f6]">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-8 w-8 animate-spin items-center justify-center rounded-full border-2 border-neutral-300 border-t-neutral-800 dark:border-neutral-800 dark:border-t-white" />
          <span className="text-xs font-mono text-neutral-400">Restoring RescueNet Session...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
