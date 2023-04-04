import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";

export default function ({ children }) {
  const auth = useAuth();

  if (auth.loading) {
    return <LoadingSpinner />;
  }
  return auth.user ? children : <Navigate to="/" />;
}
