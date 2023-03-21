import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     console.log("Token is set");
  //   }
  // }, []);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("token", user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
