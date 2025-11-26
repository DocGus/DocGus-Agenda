import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const { store } = useGlobalReducer();
  const location = useLocation();

  const isAuth = store?.auth?.isAuthenticated;
  const userRole = store?.auth?.user?.role;

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Not authorized for this role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
