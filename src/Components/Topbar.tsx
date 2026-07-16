import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// topbarTabs.ts


const getTabs = (pathname: string) => {
  if (
    pathname.startsWith("/admin/overview") ||
    pathname.startsWith("/admin/performance-reports") ||
    pathname.startsWith("/admin/financial-reports") ||
    pathname.startsWith("/admin/user-reports") ||
    pathname.startsWith("/admin/customer-satisfaction")
  ) {
    return topbarTabs.home;
  }

  if (pathname.startsWith("/admin/users")) {
    return topbarTabs.users;
  }

  if (pathname.startsWith("/admin/track")) {
    return topbarTabs.tracking;
  }

  if (pathname.startsWith("/admin/properties")) {
    return topbarTabs.properties;
  }

  if (pathname.startsWith("/admin/schedule")) {
    return topbarTabs.schedules;
  }



  // No matching tabs
  return [];
};

export const topbarTabs = {

  home: [
    { label: "Overview", path: "/admin/overview" },
    { label: "Performance Reports", path: "/admin/performance-reports" },
    { label: "Financial Reports", path: "/admin/financial-reports" },
    { label: "User Reports", path: "/admin/user-reports" },
    { label: "Customer Satisfaction", path: "/admin/customer-satisfaction" },
  ],

  users: [
    { label: "All Customers", path: "/admin/users" },
    
    { label: "Providers", path: "/admin/users/providers" },
   
  ],

  tracking: [
    { label: "Track Requests", path: "/admin/track" },
    { label: "History", path: "/admin/track/history" },
  ],

  properties: [
    { label: "Overview", path: "/admin/properties" },
    { label: "Pending", path: "/admin/properties/pending" },
    { label: "Approved", path: "/admin/properties/approved" },
    { label: "Rejected", path: "/admin/properties/rejected" },
  ],
  schedules: [
{    label: "Schedules", path: "/admin/schedule"}
  ],



};

// const Topbar = ({ openSidebar }: TopbarProps) => {
const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const location = useLocation();
  const nav = useNavigate();

  const tabs = getTabs(location.pathname);

  return (
    <header
      className="flex h-14 items-center border-b bg-white px-3 sm:h-[60px] sm:px-5"
      style={{
        borderColor: "#eaecf3",
      }}
    >
      <button type="button" onClick={onMenuClick} aria-label="Open navigation menu" className="mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden">
        <Menu size={21} />
      </button>
      {tabs.length > 0 && <nav aria-label="Page navigation" className="flex h-full min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              className="h-full whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-4"
              style={{
                borderBottomColor: isActive ? "#007AFF" : "transparent",
                color: isActive ? "#007AFF" : "#8b94b2",
              }}
              onClick={() => nav(tab.path)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>}
    </header>
  );
};

export default Topbar;
