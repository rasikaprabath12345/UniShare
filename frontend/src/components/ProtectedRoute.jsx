import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Wraps any page that requires authentication.
 * Redirects unauthenticated users to /login with the intended path saved in state,
 * so Login.jsx can redirect back after a successful sign-in.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;