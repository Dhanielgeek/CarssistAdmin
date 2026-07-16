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
const Topbar = () => {
  const location = useLocation();
  const nav = useNavigate();

  const tabs = getTabs(location.pathname);

  // Don't render the topbar if there are no tabs
  if (tabs.length === 0) {
    return null;
  }

  return (
    <header
      className="flex items-center justify-between px-5 border-b"
      style={{
        height: 60,
        background: "#ffffff",
        borderColor: "#eaecf3",
        marginLeft: "4px",
        transition: "margin-left 0.3s",
      }}
    >
      <nav className="flex items-center gap-1 h-full overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              className="px-4 h-full text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
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
      </nav>
    </header>
  );
};

export default Topbar;