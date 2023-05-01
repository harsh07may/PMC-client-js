import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";

export default function ({ children }) {
  const auth = useAuth();

  return auth.user.role == "admin" ? (
    children
  ) : (
    <Navigate to="/AppGallery" replace />
  );
}
