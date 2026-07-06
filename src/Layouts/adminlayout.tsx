// import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import RightPanel from "../Components/Rightpanel";
import { Outlet, useLocation } from "react-router-dom";

const Adminlayout = () => {
  // const [openSidebar, setopenSidebar] = useState(false)

  const location = useLocation();

  const rightPanelRoutes = [
    "/admin/overview",
    "/admin/performance-reports",
    "/admin/financial-reports",
    "/admin/user-reports",
    "/admin/customer-satisfaction",
  ];

  const showRightPanel = rightPanelRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen" style={{ background: "#f5f6fa" }}>
      <Sidebar />

      {showRightPanel && <RightPanel />}

      <div
        style={{
          marginLeft: 201,
          marginRight: showRightPanel ? 270 : 0,
          transition: "margin 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Topbar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Adminlayout;