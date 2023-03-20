import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function ({ children }) {
  const auth = useAuth();
  if (!auth.user) {
    return <Navigate to="/" />;
  }
  return children;
}
