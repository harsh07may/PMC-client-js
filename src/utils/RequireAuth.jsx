import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function ({ children }) {
  const auth = useAuth();

  if (!auth.user) {
    console.log("token unset");
    return <Navigate to="/" />;
  }
  return children;
}
