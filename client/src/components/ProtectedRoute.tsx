import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type React from "react";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
