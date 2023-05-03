import React from "react";
import { useAuth } from "./auth";
import jwt from "jwt-decode";
import { getDefaultDigitizationRoute } from "./fns";

const DefaultDigitizationRoute = () => {
  const auth = useAuth();
  return getDefaultDigitizationRoute(jwt(auth.user.accesstoken).perms);
};

export default DefaultDigitizationRoute;
