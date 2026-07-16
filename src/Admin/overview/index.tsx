import Sparkline from "../../Components/Charts/sparkline"
import PieChart from "../../Components/Charts/piechart"
import BarChart from "../../Components/Charts/barchart"
import { Star, CloudDownload } from "lucide-react"
import { useEffect, useState } from "react";
import axios from "../../Config/axiosconfig"




interface Analytics {
  total_users: number;
  total_providers: number;
  total_bookings: number;
  completed_jobs: number;
  total_revenue: string;
}




const spark1 = [30, 45, 38, 55, 48, 60, 52, 70, 65, 80]
const spark2 = [20, 35, 28, 40, 38, 55, 50, 45, 58, 62]
const spark3 = [50, 40, 45, 38, 52, 48, 55, 50, 60, 58]
const spark4 = [10, 20, 15, 30, 22, 35, 28, 40, 36, 50]







const barData = [
  { month: "Jan", ios: 32, android: 28, web: 20 },
  { month: "Feb", ios: 40, android: 35, web: 25 },
  { month: "Mar", ios: 28, android: 22, web: 18 },
  { month: "Apr", ios: 45, android: 38, web: 30 },
  { month: "May", ios: 38, android: 32, web: 22 },
  { month: "Jun", ios: 50, android: 42, web: 35 },
  { month: "Jul", ios: 44, android: 36, web: 28 },
  { month: "Aug", ios: 48, android: 40, web: 32 },
  { month: "Sep", ios: 42, android: 34, web: 26 },
  { month: "Oct", ios: 36, android: 30, web: 20 },
  { month: "Nov", ios: 30, android: 25, web: 18 },
  { month: "Dec", ios: 52, android: 44, web: 36 },
]

const regions = [
  { name: "Region A", size: 2, color: "#22c55e" },
  { name: "Region B", size: 1, color: "#22c55e" },
  { name: "Region C", size: 2, color: "#e8a838" },
  { name: "Region D", size: 1, color: "#22c55e" },
  { name: "Reg", size: 1, color: "#ef4444" },
  { name: "Top", size: 1, color: "#e8a838" },
  { name: "Region E", size: 2, color: "#ef4444" },
  { name: "Region F", size: 1, color: "#ef4444" },
  { name: "Region G", size: 2, color: "#22c55e" },
  { name: "Reg H", size: 1, color: "#e8a838" },
  { name: "Region I", size: 2, color: "#3b82f6" },
  { name: "Region J", size: 1, color: "#22c55e" },
  { name: "Major Region Alpha", size: 3, color: "#22c55e" },
  { name: "Region K", size: 1, color: "#e8a838" },
  { name: "Major Region Beta", size: 3, color: "#ef4444" },
  { name: "R L", size: 1, color: "#ef4444" },
]

const Overview = () => {
const [analytics, setAnalytics] = useState<Analytics>({
  total_users: 0,
  total_providers: 0,
  total_bookings: 0,
  completed_jobs: 0,
  total_revenue: "$0.00",
});


const revenueCards = [
  {
    label: "Total Revenue",
    value: analytics.total_revenue,
    spark: spark2,
    color: "#22c55e",
  },
];


const statCards = [
  {
    label: "Total Users",
    value: analytics.total_users.toLocaleString(),
    spark: spark1,
    color: "#3b82f6",
  },
  {
    label: "Total Providers",
    value: analytics.total_providers.toLocaleString(),
    spark: spark2,
    color: "#22c55e",
  },
  {
    label: "Total Bookings",
    value: analytics.total_bookings.toLocaleString(),
    spark: spark3,
    color: "#e8a838",
  },
  {
    label: "Completed Jobs",
    value: analytics.completed_jobs.toLocaleString(),
    spark: spark4,
    color: "#a855f7",
  },
];

const token = localStorage.getItem("token")

const getAnalytics = async () => {
  try {
    const res = await axios.get("/admin/analytics", {
      
           headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });

    if (res.data.status) {
      setAnalytics(res.data.data);
    }
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
  }
};

useEffect(() => {
  getAnalytics();
}, []);



  return (
    <div className="flex flex-col gap-5">
      <div className="w-full h-12.5 mt-2  flex justify-end  items-center">
        <div className="w-[11%] h-[70%] cursor-pointer rounded-md text-xs border flex justify-center gap-2 items-center">
<CloudDownload  size={17}/> Export
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(c => (
          <div key={c.label} className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
            <p className="text-xs mb-1 font-medium" style={{ color: "#575757" }}>{c.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold" style={{ color: "#2d3452" }}>{c.value}</p>
              <Sparkline data={c.spark} color={c.color} />
            </div>
          </div>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {revenueCards.map(c => (
          <div key={c.label} className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
            <p className="text-xs mb-1 font-medium" style={{ color: "#575757" }}>{c.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold" style={{ color: "#2d3452" }}>{c.value}</p>
              <Sparkline data={c.spark} color={c.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Ratings + Extra Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Checkins */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Monthly Check-ins</p>
          <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>200</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} fill="#e8a838" stroke="#e8a838" />
            <span className="text-xs font-semibold" style={{ color: "#e8a838" }}>4.8 / 5</span>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Star Rating Number</p>
          <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>4.6/5</p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= 4 ? "#e8a838" : "#eaecf3"} stroke={s <= 4 ? "#e8a838" : "#eaecf3"} />
            ))}
          </div>
        </div>

        {/* Extra quick stats */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Avg. Booking Duration</p>
          <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>4.6 / 5</p>
          <Sparkline data={spark2} color="#e8a838" width={90} />
        </div>
      </div>

      {/* Financial Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: "12000" },
          { label: "Booking Revenue", value: "$304,000" },
          { label: "Net Revenue", value: "$04,000" },
          { label: "Gross Revenue", value: "$900 M" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
            <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: "#2d3452" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* % Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Booking Conversion Rate", value: "$340", sub: null },
          { label: "Booking Cancellation Rate", value: "70.4%", sub: null },
          { label: "Booking Rate vs Booking % Rate", value: "4.0%", sub: "68% / 60%" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
            <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: "#2d3452" }}>{s.value}</p>
            {s.sub && <p className="text-xs mt-1" style={{ color: "#8b94b2" }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <PieChart
            title="Ranking by Platform without Agent"
            data={[
              { value: 45, color: "#3b82f6", label: "iOS" },
              { value: 30, color: "#22c55e", label: "Android" },
              { value: 25, color: "#e8a838", label: "Web" },
            ]}
            size={110}
          />
        </div>
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <PieChart
            title="Earnings by Activity on DirectNow Ap"
            data={[
              { value: 40, color: "#e8a838", label: "Direct" },
              { value: 35, color: "#6366f1", label: "Agent" },
              { value: 25, color: "#d1d5db", label: "Other" },
            ]}
            size={110}
            innerRadius={30}
          />
        </div>
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <PieChart
            title="Booking Annotated to Completion"
            data={[
              { value: 60, color: "#22c55e", label: "Completed" },
              { value: 25, color: "#ef4444", label: "Cancelled" },
              { value: 15, color: "#f59e0b", label: "Pending" },
            ]}
            size={110}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl p-5 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>Platform Earnings by Month</p>
          <div className="flex gap-4">
            {[
              { label: "iOS", color: "#3b82f6" },
              { label: "Android", color: "#22c55e" },
              { label: "Web", color: "#e8a838" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="rounded-sm" style={{ width: 10, height: 10, background: l.color, display: "block" }} />
                <span className="text-xs" style={{ color: "#8b94b2" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <BarChart data={barData} />
      </div>

      {/* Revenue by Region heatmap */}
      <div className="rounded-xl p-5 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>Revenue by Region</p>
          <div className="flex gap-4">
            {[
              { label: "High", color: "#22c55e" },
              { label: "Medium", color: "#e8a838" },
              { label: "Low", color: "#ef4444" },
              { label: "N/A", color: "#3b82f6" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="rounded-sm" style={{ width: 10, height: 10, background: l.color, display: "block" }} />
                <span className="text-xs" style={{ color: "#8b94b2" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((r, i) => (
            <div
              key={i}
              className="rounded-lg flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{
                background: r.color,
                padding: "8px 12px",
                minWidth: r.size === 3 ? 140 : r.size === 2 ? 90 : 60,
                opacity: 0.85 + i * 0.01,
              }}
            >
              {r.name}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Overview