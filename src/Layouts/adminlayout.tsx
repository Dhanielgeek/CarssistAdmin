import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import RightPanel from "../Components/Rightpanel";
import { Outlet, useLocation } from "react-router-dom";

const Adminlayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#f5f6fa" }}>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {showRightPanel && <RightPanel />}

      <div
        className={`min-h-screen transition-[margin] duration-300 lg:ml-[201px] ${
          showRightPanel ? "xl:mr-[270px]" : ""
        }`}
      >
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Adminlayout;
