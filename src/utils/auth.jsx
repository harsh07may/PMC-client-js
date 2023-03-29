import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function checkRefreshToken() {
      axios
        .post(
          "http://localhost:5000/api/v1/user/refresh_token",
          {},
          {
            credentials: "include",
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("token set");
          setUser(res.data.accesstoken);
        })
        .catch((err) => {
          console.log("Error" + err);
        });
    }
    checkRefreshToken();
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    axios
      .post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        {
          credentials: "include",
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        setUser(null);
      })
      .catch((err) => {
        console.log("Error" + err);
      });
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
