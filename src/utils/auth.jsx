import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkRefreshToken = () => {
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
          if (res.data.accesstoken === "") {
            //* no access token, redirect to login page
            navigate("/", { replace: true });
          }
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error" + err);
        });
    };
    return checkRefreshToken;
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
        // console.log(res.data);
        setUser(null);
      })
      .catch((err) => {
        console.log("Error" + err);
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
