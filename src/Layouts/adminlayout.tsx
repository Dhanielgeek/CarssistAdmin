// import { useState } from "react"
import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import RightPanel from "../Components/Rightpanel"
import { Outlet, useLocation } from "react-router-dom"

const Adminlayout = () => {
  // const [openSidebar, setopenSidebar] = useState(false)
  // const sideW = openSidebar ? 200 : 60
  // const rightW = 220

    const location = useLocation();

  const showRightPanel = location.pathname === "/admin/overview";

  return (
    <div className="min-h-screen" style={{ background: "#f5f6fa" }}>
      <Sidebar  />
      {showRightPanel && <RightPanel />}
 {/* openSidebar={openSidebar} setopenSidebar={setopenSidebar} */}
      <div
        style={{
          marginLeft: 201,
          marginRight: 270,
          transition: "margin-left 0.3s",
          minHeight: "100vh",
        }}
      >
        <Topbar  />
        {/* openSidebar={openSidebar} setopenSidebar={setopenSidebar} */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Adminlayout