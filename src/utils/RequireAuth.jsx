const PORT = import.meta.env.VITE_PORT;
const HOST = import.meta.env.VITE_HOST;
const PROTOCOL = import.meta.env.VITE_PROTOCOL;
import React, { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "./auth";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import { getEnv } from "./getEnv";

export default function ({ children }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const openErrorNotification = () => {
    notification.error({
      message: "Oops! Something went wrong.",
      description: "Try again",
    });
  };
  const checkRefreshToken = () => {
    axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/user/refresh_accessToken`,
        {},
        {
          credentials: "include",
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.accesstoken === "") {
          // no access token, redirect to login page
          navigate("/", { replace: true });
        }
        auth.login(res.data);
        auth.setLoading(false);
      })
      .catch((err) => {
        //crash case
        openErrorNotification();
        navigate("/", { replace: true });
        // console.log("Error" + err);
      });
  };
  useEffect(() => {
    checkRefreshToken();
  }, []);
  if (auth.loading) {
    return <LoadingSpinner />;
  }
  return auth.user ? children : <Navigate to="/" />;
}
