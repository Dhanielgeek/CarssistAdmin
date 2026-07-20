


import {
  ChevronDown,
  Home,
  Users,
  MapPin,
  CalendarDays,
  Bell,
  CreditCard,
  Banknote,
  Settings, X,
} from "lucide-react";
import { useState } from "react";
import logo from "../assets/carsisstlogo.png";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

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
      // { label: "Onboard New User", path: "/admin/users/onboard" },
     
      { label: "Providers", path: "/admin/users/providers" },
    
    ],
  },

  {
    icon: MapPin,
    label: "Track",
    children: [
      { label: "Track", path: "/admin/track" },
      { label: "All Requests", path: "/admin/track/all-request" },
   
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
    // children: [
    //   { label: "Manage Notifications", path: "/admin/notifications" },
    //   { label: "Send Notification", path: "/admin/notifications/send" },
    //   { label: "All Notifications", path: "/admin/notifications/all" },
    //   { label: "Motorist", path: "/admin/notifications/motorists" },
    //   {
    //     label: "Carssist Rider Notification",
    //     path: "/admin/notifications/carssist-riders",
    //   },
    //   {
    //     label: "Chauffer Rider Notification",
    //     path: "/admin/notifications/chauffeur-riders",
    //   },
    // ],
    path: "/admin/notifications"
  },

  {
    icon: CreditCard,
    label: "Payments",
    children: [
      { label: "Payments", path: "/admin/payments" },
    ],
  },

  {
    icon: Banknote,
    label: "Payouts",
    path: "/admin/payouts"
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
  },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {

const [openDropdown, setOpenDropdown] = useState<string | null>(null);

const nav = useNavigate();
const location = useLocation();




  return (
    <aside
      aria-label="Primary navigation"
      className={`fixed inset-y-0 left-0 z-30 flex w-49.25 flex-col border-r border-[#e2e5ea] bg-[#f0f2f5] shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
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
          <div className="flex h-20 items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <button type="button" onClick={onClose} aria-label="Close navigation menu" className="absolute right-1 top-3 grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden">
            <X size={20} />
          </button>

      

       
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
            fontSize: 10,
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
            onClose();
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
                  onClose();
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
    onClose();
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
            fontSize: 11,
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
                onClose();
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
