import React from "react";
import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";
import jwt from "jwt-decode";
import { checkPermission } from "./fns";

export default function (props) {
  const auth = useAuth();
  //   console.log(jwt(auth.user.accesstoken).perms);

  return checkPermission(
    jwt(auth.user.accesstoken).perms,
    props.resource,
    props.accessLevel
  ) ? (
    props.children
  ) : (
    <Navigate to="/AppGallery" replace />
  );
}
