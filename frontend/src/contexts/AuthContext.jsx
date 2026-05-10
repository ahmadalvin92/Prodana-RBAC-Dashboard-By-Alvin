import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../services/tokenStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = async (credentials) => {
    setIsAuthenticating(true);

    try {
      const response = await authService.login(credentials);
      tokenStorage.setToken(response.data.token);
      tokenStorage.setUser(response.data.user);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    tokenStorage.clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role?.name || user?.role,
      isAuthenticated: Boolean(token && user),
      isAuthenticating,
      login,
      logout,
    }),
    [user, token, isAuthenticating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
