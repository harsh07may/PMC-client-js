import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function ({ children }) {
  const auth = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      auth.login(localStorage.getItem("token"));
    }
  }, []);
  if (!auth.user && !localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  return children;
}
