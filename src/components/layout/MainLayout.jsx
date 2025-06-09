import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

const MainLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/register"];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;