import { createContext, useContext, useState } from "react";

const defaultContext = {
  user: null,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultContext);

export const useAuth = () => useContext(AuthContext) ?? defaultContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) localStorage.setItem("token", userData.token);
    else localStorage.removeItem("token");
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
