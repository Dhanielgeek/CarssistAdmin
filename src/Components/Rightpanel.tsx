import { useState } from "react";

const services = [
  { name: "Tire Fix", amount: "$45.00" },
  { name: "Jump", amount: "$245.00" },
  { name: "Jump", amount: "$245.00" },
  { name: "Tyre", amount: "$45.00" },
  { name: "Fuel", amount: "$245.00" },
  { name: "Fuel", amount: "$245.00" },
  { name: "Jump", amount: "$245.00" },
  { name: "Tire Fix", amount: "$245.00" },
  { name: "Fuel", amount: "$245.00" },
  { name: "Tire Fix", amount: "$245.00" },
  { name: "Jump", amount: "$245.00" },
  { name: "Fuel", amount: "$245.00" },
  { name: "Tire Fix", amount: "$245.00" },
];

const tabs = [
  "Today",
  "All Time",
  "Yesterday",
  "Last Week",
  "Last Month",
  "Last Quarter",
];

const RightPanel = () => {


  const [activeTab, setActiveTab] = useState("Today");
  return (
    <aside
      className="fixed top-0 right-0 h-screen overflow-y-auto p-4"
      style={{
        width: 260,
        background: "#edf2f7",
        borderLeft: "1px solid #dbe4ee",
      }}
    >
      {/* Filters */}

      <div className="space-y-3">
        <div>
          <p className="text-[11px] mb-1 text-gray-500 font-medium">
            Date range
          </p>

          <div className="grid grid-cols-2 gap-2">
            <select className="bg-white rounded-md h-10 px-3 text-xs border border-gray-200">
              <option>10-06-2021</option>
            </select>

            <select className="bg-white rounded-md h-10 px-3 text-xs border border-gray-200">
              <option>10-10-2021</option>
            </select>
          </div>
        </div>

        <select className="bg-white rounded-md h-10 px-3 text-xs border border-gray-200 w-[70%]">
          <option>Revenue by service</option>
        </select>
      </div>

      {/* Revenue Card */}

      <div
        className="mt-5 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#49B4FF,#2F9BEA)",
        }}
      >
        <div className="p-4 text-white">
          <h2 className="font-bold text-xl">Carssist Bank AC</h2>

          <p className="text-sm mt-1">
            <span className="font-semibold">Total:</span> $10,000
          </p>
        </div>

   {/* Tabs */}

<div className="bg-white rounded-lg p-0.75 shadow-sm overflow-x-auto">
  <div className="flex w-max">
    {tabs.map((tab) => {
      const active = activeTab === tab;

      return (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-md text-[13px] transition-all duration-200 ${
            active
              ? "bg-gray-100 text-gray-900 font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab}
        </button>
      );
    })}
  </div>
</div>

        {/* Revenue */}

        <div className="px-4 pb-5">
          <h3 className="text-white font-semibold mb-4 text-lg">
            Revenue by Service:
          </h3>

          <div className="space-y-2 max-h-120 overflow-y-auto pr-1">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex justify-between text-white text-sm"
              >
                <span>{service.name}</span>

                <span className="font-semibold">{service.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;