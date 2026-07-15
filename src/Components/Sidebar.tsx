


import {
  ChevronDown,
  Home,
  Users,
  MapPin,
  CalendarDays,
  Bell,
  CreditCard,
  Banknote,
  Settings,
} from "lucide-react";
import { useState } from "react";
import logo from "../assets/carsisstlogo.png";
import { useLocation, useNavigate } from "react-router-dom";

// interface SidebarProps {
//   openSidebar: boolean;
//   setopenSidebar: (val: boolean) => void;
// }

const mainNav = [
  {
    icon: Home,
    label: "Home",
    path: "/admin/overview",
  },

  {
    icon: Users,
    label: "Users",
    children: [
      { label: "All Users", path: "/admin/users" },
      { label: "Onboard New User", path: "/admin/users/onboard" },
     
      { label: "Providers", path: "/admin/users/providers" },
    
    ],
  },

  {
    icon: MapPin,
    label: "Track",
    children: [
      { label: "Manage Requests", path: "/admin/track" },
      { label: "Pending Requests", path: "/admin/track/pending" },
      { label: "In Progress Requests", path: "/admin/track/in-progress" },
      { label: "Completed Requests", path: "/admin/track/completed" },
      { label: "Canceled Requests", path: "/admin/track/cancelled" },
      { label: "History", path: "/admin/track/history" },
    ],
  },

  {
    icon: CalendarDays,
    label: "Bookings",
    children: [
   
      { label: "View All Bookings", path: "/admin/schedule" },
   
    ],
  },
];

const othersNav = [
  {
    icon: Bell,
    label: "Notifications",
    children: [
      { label: "Manage Notifications", path: "/admin/notifications" },
      { label: "Send Notification", path: "/admin/notifications/send" },
      { label: "All Notifications", path: "/admin/notifications/all" },
      { label: "Motorist", path: "/admin/notifications/motorists" },
      {
        label: "Carssist Rider Notification",
        path: "/admin/notifications/carssist-riders",
      },
      {
        label: "Chauffer Rider Notification",
        path: "/admin/notifications/chauffeur-riders",
      },
    ],
  },

  {
    icon: CreditCard,
    label: "Payments",
    children: [
      { label: "Manage Payments", path: "/admin/payments" },
      { label: "Pending Payments", path: "/admin/payments/pending" },
      { label: "Completed Payments", path: "/admin/payments/completed" },
      {
        label: "Carssist User Payments",
        path: "/admin/payments/carssist-users",
      },
      { label: "Rejected Payments", path: "/admin/payments/rejected" },
      { label: "History", path: "/admin/payments/history" },
    ],
  },

  {
    icon: Banknote,
    label: "Payouts",
    children: [
      { label: "Manage Payouts", path: "/admin/payouts" },
      { label: "Pending Payouts", path: "/admin/payouts/pending" },
      { label: "Completed Payouts", path: "/admin/payouts/completed" },
      { label: "Rejected Payouts", path: "/admin/payouts/rejected" },
      {
        label: "Carssist Rider Payouts",
        path: "/admin/payouts/carssist-riders",
      },
      {
        label: "Chauffer Rider Payouts",
        path: "/admin/payouts/chauffeur-riders",
      },
      { label: "History", path: "/admin/payouts/history" },
    ],
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
  },
];

const Sidebar = () => {
  // { openSidebar, setopenSidebar }: SidebarProps

const [openDropdown, setOpenDropdown] = useState<string | null>(null);

const nav = useNavigate();
const location = useLocation();




  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        width: 197,
        // width: openSidebar ? 240 : 72,

        background: "#f0f2f5",
        borderRight: "1px solid #e2e5ea",
        transition: "width 0.3s",
      }}
    >
      {/* ── Header Card ── */}
      <div
        style={{
          position: "relative",
          margin: "12px 12px 0",
          borderRadius: 16,
        }}
      >
       
          {/* Logo */}
          <div className="h-20 flex justify-center items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

      

       
      </div>

      {/* ── Navigation ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 10px 16px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1a6ff5",
            letterSpacing: 1.2,
            margin: "0 4px 8px",
          }}
        >
          MAIN
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >

        </div>
{mainNav.map(({ icon: Icon, label, children, path }) => {

const isActive =
  path === location.pathname ||
  children?.some(child => child.path === location.pathname);

  const isOpen =
  openDropdown === label ||
  children?.some(child => child.path === location.pathname);

  return (
    <div key={label}>
      <button
        onClick={() => {
        

          if (children) {
            setOpenDropdown(isOpen ? null : label);
          } else if (path) {
            nav(path);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          borderRadius: 12,
          padding: "10px 12px",
          justifyContent: "flex-start",
          background: isActive ? "#1a6ff5" : "transparent",
          color: isActive ? "#fff" : "#1a1f2e",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Icon size={18} />

        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
          }}
        >
          {label}
        </span>

        {children && (
          <ChevronDown
            size={15}
            style={{
              transition: "0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </button>

      {children && isOpen && (
        <div
          style={{
            marginLeft: 2,
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {children.map((child) => {
            const childActive = location.pathname === child.path;

            return (
              <button
                key={child.path}
                onClick={() => {
                 
                  nav(child.path);
                }}
                style={{
                  border: "none",
                  background: childActive ? "#fff" : "transparent",
                  color: childActive ? "#007AFF" : "#555",
                  borderRadius: 8,
                  padding: "8px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 400,
                }}
              >
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
})}
        <div
          style={{
            height: 1,
            background: "#dde1e9",
            margin: "16px 4px",
          }}
        />

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1a6ff5",
            letterSpacing: 1.2,
            margin: "0 4px 8px",
          }}
        >
          OTHERS
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
 {othersNav.map(({ icon: Icon, label, children, path }) => {

const isActive =
  path === location.pathname ||
  children?.some(child => child.path === location.pathname);

const isOpen =
  openDropdown === label ||
  children?.some(child => child.path === location.pathname);

  return (
    <div key={label}>
      <button
        onClick={() => {
         if (children) {
    setOpenDropdown(isOpen ? null : label);
  } else if (path) {
    nav(path);
  }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          borderRadius: 12,
          padding: "10px 12px",
          justifyContent: "flex-start",
          background: isActive ? "#1a6ff5" : "transparent",
          color: isActive ? "#fff" : "#1a1f2e",
          border: "none",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
        }}
      >
        <Icon size={18} />

        <span
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
          }}
        >
          {label}
        </span>

        {children && (
          <ChevronDown
            size={15}
            style={{
              transition: "0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        )}
      </button>

      {children && isOpen && (
        <div
          style={{
            marginLeft: 2,
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {children.map((child) => {
            const childActive = location.pathname === child.path;

            return (
              <button
                key={child.path}
                onClick={() => {
               
                  nav(child.path);
                }}
                style={{
                  border: "none",
                  background: childActive ? "#fff" : "transparent",
                  color: childActive ? "#007AFF" : "#555",
                  borderRadius: 8,
                  padding: "8px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 400,
                }}
              >
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
})}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;