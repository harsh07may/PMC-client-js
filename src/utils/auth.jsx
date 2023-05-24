const PORT = import.meta.env.VITE_PORT;
const HOST = import.meta.env.VITE_HOST;
const PROTOCOL = import.meta.env.VITE_PROTOCOL;
import { useState, createContext, useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { getEnv } from "./getEnv";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const login = (accessToken) => {
    // console.log(jwt(accessToken));
    setUser({ accesstoken: accessToken });
  };

  const logout = () => {
    axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/user/logout`,
        {},
        {
          credentials: "include",
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log(res.data);
        setUser(null);
      })
      .catch((err) => {
        openErrorNotification();
        // console.log("Error" + err);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
