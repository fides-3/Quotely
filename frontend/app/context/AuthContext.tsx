'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

// 1. Define the shape of AuthState
interface AuthState {
  accessToken: string | null;
  user: Record<string, unknown> | null; // can be replaced with your actual User type
}

// 2. Define the shape of what the context provides
interface AuthContextType {
  auth: AuthState;
  setAuth: (newAuth: AuthState) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// 3. Create context with proper type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    accessToken: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedAuth: AuthState = JSON.parse(storedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error("Error parsing stored auth:", error);
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const updateAuth = (newAuth: AuthState) => {
    console.log('AuthContext: Setting new auth state:', newAuth);
    setAuth(newAuth);
    if (newAuth.accessToken) {
      localStorage.setItem("auth", JSON.stringify(newAuth));
      console.log('AuthContext: Stored in localStorage');
    } else {
      localStorage.removeItem("auth");
      console.log('AuthContext: Removed from localStorage');
    }
  };

  const logout = () => {
    setAuth({ accessToken: null, user: null });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth: updateAuth,
        logout,
        isAuthenticated: !!auth.accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
