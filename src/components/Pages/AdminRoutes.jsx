import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth} from "../auth/AuthProvider";

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user || !["ROLE_ADMIN", "ROLE_SUPERADMIN"].includes(user.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
};

export default AdminRoutes;