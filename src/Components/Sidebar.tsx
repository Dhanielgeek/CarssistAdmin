


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

// interface SidebarProps {
//   openSidebar: boolean;
//   setopenSidebar: (val: boolean) => void;
// }

const mainNav = [
  { icon: Home, label: "Home", active: true },
  { icon: Users, label: "Users",
      children: [
      "Manage Users",
      "Onboard New User",
      "Motorist",
      "Carssist Rider",
      "Chauffer Rider",
    ],
    },
  { icon: MapPin, label: "Track" , children:[
    "Manage Requests",
    "Pending Requests",
    "In Progress Requests",
    "Completed Requests",
    "Canceled Requests",
    "History"
  ]},
  { icon: CalendarDays, label: "Schedules", children:
    [
      "Manage Schedules",
      "View All Schedules",
      "History"
    ]
   },
];

const othersNav = [
  { icon: Bell, label: "Notifications", children:[
    "Manage Notifications",
    "Send Notification",
    "All Notifications",
    "Motorist",
    "Carssist Rider Notification",
    "Chauffer Rider Notification"
  ] },
  { icon: CreditCard, label: "Payments", children:[
        "Manage Payments",
      "Pending Payments",
      "Completed Payments",
      "Carssist User Payments",
      "Rejected  Payments",
      "History",
  
  ] },
  { icon: Banknote, label: "Payouts",
       children: [
      "Manage Payouts",
      "Pending Payouts",
      "Completed Payouts",
      "Rejected Payouts",
      "Carssist Rider Payouts",
      "Chauffer Rider Payouts",
      "History"
    ],
   },
  { icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  // { openSidebar, setopenSidebar }: SidebarProps
const [activeItem, setActiveItem] = useState("Home");
const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
        <div
          style={{
            // background: "linear-gradient(135deg, #1a6ff5 0%, #0d52cc 100%)",
            // borderRadius: 16,
            // display: "flex",
            // alignItems: "center",
            // gap: 10,
            // padding: openSidebar ? "18px 14px" : "18px 0",
            // justifyContent: openSidebar ? "flex-start" : "center",
            // transition: "all 0.3s",
            // minHeight: 78,
          }}
        >
          {/* Logo */}
          <div className="bg-[#007AFF] h-20 flex justify-center items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover bg-white"
            />
          </div>

          {/* {openSidebar && (
            <div>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: 0.8,
                  lineHeight: 1,
                  margin: 0,
                }}
              ></p>

              <p
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 8.5,
                  letterSpacing: 2,
                  marginTop: 3,
                }}
              ></p>
            </div>
          )} */}
        </div>

        {/* Collapse Toggle */}
        {/*
        <button
          onClick={() => setopenSidebar(!openSidebar)}
          style={{
            position: "absolute",
            right: -14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#fff",
            border: "1px solid #dde1e9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#444",
            letterSpacing: -1,
            zIndex: 5,
          }}
        >
          &lt;&gt;
        </button>
        */}
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
       {mainNav.map(({ icon: Icon, label, children }) => {
  const isActive = activeItem === label;
  const isOpen = openDropdown === label;

  return (
    <div key={label}>
      <button
        onClick={() => {
          setActiveItem(label);

          if (children) {
            setOpenDropdown(isOpen ? null : label);
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
          {children.map((item) => (
            <button
              key={item}
              onClick={() => setActiveItem(item)}
              style={{
                border: "none",
                background: activeItem === item ? "#fff" : "transparent",
                color: activeItem === item ? "#007AFF" : "#555",
                borderRadius: 8,
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 11,

                fontWeight: 400
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
})}
        </div>

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
       {othersNav.map(({ icon: Icon, label, children }) => {
  const isActive = activeItem === label;
  const isOpen = openDropdown === label;

  return (
    <div key={label}>
      <button
        onClick={() => {
          setActiveItem(label);

          if (children) {
            setOpenDropdown(isOpen ? null : label);
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
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLElement).style.background = "#e2e8f0";
        }}
        onMouseLeave={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />

        <span
          style={{
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
            flex: 1,
          }}
        >
          {label}
        </span>

        {children && (
          <ChevronDown
            size={15}
            style={{
              color: isActive
                ? "rgba(255,255,255,0.7)"
                : "#9ca3af",
              flexShrink: 0,
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
          {children.map((item) => (
            <button
              key={item}
              onClick={() => setActiveItem(item)}
              style={{
                border: "none",
                background: activeItem === item ? "#fff" : "transparent",
                color: activeItem === item ? "#007AFF" : "#555",
                borderRadius: 8,
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 400,
              }}
            >
              {item}
            </button>
          ))}
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