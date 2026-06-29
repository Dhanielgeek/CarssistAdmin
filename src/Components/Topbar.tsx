


// import { Bell, ChevronDown } from "lucide-react";

// interface TopbarProps {
//   openSidebar: boolean;
//   setopenSidebar: (val: boolean) => void;
// }

const tabs = [
  "Overview",
  "Performance Reports",
  "Financial Reports",
  "User Reports",
  "Customer Satisfaction",
];

// const Topbar = ({ openSidebar }: TopbarProps) => {
const Topbar = () => {
  return (
    <header
      className="flex items-center justify-between px-5 border-b"
      style={{
        height: 60,
        background: "#ffffff",
        borderColor: "#eaecf3",

        marginLeft: "4px",
        // marginLeft: openSidebar ? "200px" : "60px",

        transition: "margin-left 0.3s",
      }}
    >
      {/* Tabs */}
      <nav className="flex items-center gap-1 h-full overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className="px-4 h-full text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            style={{
              borderBottomColor: i === 0 ? "#007AFF" : "transparent",
              color: i === 0 ? "#007AFF" : "#8b94b2",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Right Side */}
      {/*
      <div className="flex items-center gap-3 shrink-0">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ background: "#f5f6fa", color: "#555e7a" }}
        >
          <span>Sort</span>
          <ChevronDown size={14} />
        </button>

        <button
          className="relative p-2 rounded-lg"
          style={{ background: "#f5f6fa" }}
        >
          <Bell size={16} style={{ color: "#555e7a" }} />
          <span
            className="absolute top-1 right-1 rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#e8a838",
            }}
          />
        </button>

        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              width: 32,
              height: 32,
              background: "#e8a838",
            }}
          >
            JD
          </div>

          <span
            className="text-sm font-medium"
            style={{ color: "#2d3452" }}
          >
            John Doe
          </span>

          <ChevronDown
            size={14}
            style={{ color: "#8b94b2" }}
          />
        </div>
      </div>
      */}
    </header>
  );
};

export default Topbar;