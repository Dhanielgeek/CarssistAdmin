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

type RevenueTier = "high" | "medium" | "low";

interface RegionDetail {
  name: string;
  totalRevenue: string;
  pctOfPlatform: string;
  topService: string;
  avgBookingValue: string;
}

interface RegionCell {
  name: string;
  tier: RevenueTier;
  widthPercent: number;
  detail: RegionDetail;
}

const tierColors: Record<RevenueTier, string> = {
  high: "#22c55e",
  medium: "#eab308",
  low: "#ef4444",
};

const featuredRegion: RegionDetail = {
  name: "Region",
  totalRevenue: "\u20A6420 Million",
  pctOfPlatform: "35%",
  topService: "Car Assist",
  avgBookingValue: "\u20A610,200",
};

const emptyRegionDetail = (name: string): RegionDetail => ({
  name,
  totalRevenue: "N/A",
  pctOfPlatform: "N/A",
  topService: "N/A",
  avgBookingValue: "N/A",
});

// Row/cell proportions mirror the design's treemap exactly
const regionRows: { heightPercent: number; cells: RegionCell[] }[] = [
  {
    heightPercent: 20,
    cells: [
      { name: "Region", tier: "high", widthPercent: 26, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "low", widthPercent: 16, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "low", widthPercent: 16, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "low", widthPercent: 20, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "medium", widthPercent: 26, detail: emptyRegionDetail("Region") },
    ],
  },
  {
    heightPercent: 38,
    cells: [
      { name: "Region", tier: "medium", widthPercent: 42, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "high", widthPercent: 42, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "high", widthPercent: 16, detail: emptyRegionDetail("Region") },
    ],
  },
  {
    heightPercent: 26,
    cells: [
      { name: "Region", tier: "medium", widthPercent: 42, detail: emptyRegionDetail("Region") },
      { name: "Region", tier: "high", widthPercent: 58, detail: emptyRegionDetail("Region") },
    ],
  },
];

const Overview = () => {
const [analytics, setAnalytics] = useState<Analytics>({
  total_users: 0,
  total_providers: 0,
  total_bookings: 0,
  completed_jobs: 0,
  total_revenue: "$0.00",
});

const [selectedRegion, setSelectedRegion] = useState<RegionDetail>(featuredRegion);

// Group 1: user / provider / churn metrics — 3 rows of 4
const userMetricCards = [
  {
    label: "Total Users",
    value: analytics.total_users ? analytics.total_users.toLocaleString() : "N/A",
    spark: spark1,
  },
  {
    label: "Active Users",
    value: "N/A",
    spark: spark2,
  },
  {
    label: "Total Customers",
    value: "N/A",
    spark: spark3,
  },
  {
    label: "Active Customers",
    value: "N/A",
    spark: spark4,
  },
  {
    label: "Total Service Providers",
    value: analytics.total_providers ? analytics.total_providers.toLocaleString() : "N/A",
    spark: spark1,
  },
  {
    label: "Active Service Providers",
    value: "N/A",
    spark: spark2,
  },
  {
    label: "Churned Users",
    value: "N/A",
    spark: spark3,
  },
  {
    label: "Churned Customers",
    value: "N/A",
    spark: spark4,
  },
  {
    label: "Churned Service Providers",
    value: "N/A",
    spark: spark1,
  },
  {
    label: "Total Spa Assistants",
    value: "N/A",
    spark: spark2,
  },
  {
    label: "Total Spa Chauffeur",
    value: "N/A",
    spark: spark3,
  },
  {
    label: "Avg Service Provider Rating",
    value: "N/A",
    spark: spark4,
  },
];

// Group 2: sits alone on its own row, exactly like the design
const ratingCard = {
  label: "Avg Customer Rating",
  value: "N/A",
  spark: spark2,
};

// Group 3: booking / revenue metrics — 2 rows of 4
const bookingMetricCards = [
  {
    label: "Total Bookings",
    value: analytics.total_bookings ? analytics.total_bookings.toLocaleString() : "N/A",
    spark: spark1,
  },
  {
    label: "Total Bookings $",
    value: analytics.total_revenue || "N/A",
    spark: spark2,
  },
  {
    label: "Total Revenue $",
    value: analytics.total_revenue || "N/A",
    spark: spark3,
  },
  {
    label: "Net Revenue",
    value: "N/A",
    spark: spark4,
  },
  {
    label: "Platform Commission Earned",
    value: "N/A",
    spark: spark1,
  },
  {
    label: "Booking Fulfillment Rate",
    value:
      analytics.total_bookings > 0
        ? `${(
            (analytics.completed_jobs / analytics.total_bookings) *
            100
          ).toFixed(1)}%`
        : "N/A",
    spark: spark2,
  },
  {
    label: "Booking Cancellation Rate",
    value: "N/A",
    spark: spark3,
  },
  {
    label: "Bookings by New vs. Returning Customers",
    value: "N/A",
    spark: spark4,
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

const renderCard = (card: { label: string; value: string; spark: number[] }) => (
  <div
    key={card.label}
    className="rounded-xl border bg-white p-4 shadow-sm"
    style={{ borderColor: "#eaecf3" }}
  >
    <p className="mb-1 text-[11px] font-medium text-gray-500">{card.label}</p>

    <div className="flex items-end justify-between">
      <div>
        <p className="text-xl font-bold text-[#2d3452]">{card.value}</p>
      </div>

      <Sparkline data={card.spark} color="#6BCB77" />
    </div>
  </div>
);

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="mt-1 flex h-10 w-full items-center justify-end">
        <button type="button" className="flex h-9 min-w-24 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
<CloudDownload  size={17}/> Export
        </button>
      </div>

      {/* Group 1 — Users / Providers / Churn (3 rows of 4, matches design exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userMetricCards.map(renderCard)}
      </div>

      {/* Group 2 — Avg Customer Rating sits alone on its own row, same as the design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {renderCard(ratingCard)}
      </div>

      {/* Group 3 — Bookings / Revenue (2 rows of 4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bookingMetricCards.map(renderCard)}
      </div>

      {/* Ratings + Extra Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Checkins */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Monthly Check-ins</p>
        <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>N/A</p>

<div className="flex items-center gap-1 mt-1">
  <Star size={12} fill="none" stroke="#d1d5db" />
  <span className="text-xs font-semibold text-gray-400">N/A</span>
</div>
        </div>

        {/* Avg Rating */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Star Rating Number</p>
        <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>N/A</p>

<div className="flex gap-0.5 mt-1">
  {[1, 2, 3, 4, 5].map((s) => (
    <Star
      key={s}
      size={12}
      fill="none"
      stroke="#d1d5db"
    />
  ))}
</div>
        </div>

        {/* Extra quick stats */}
        <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
          <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>Avg. Booking Duration</p>
       <p className="text-2xl font-bold" style={{ color: "#2d3452" }}>N/A</p>
<Sparkline data={spark2} color="#d1d5db" width={90} />
        </div>
      </div>

      {/* Financial Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: "N/A" },
  { label: "Booking Revenue", value: "N/A" },
  { label: "Net Revenue", value: "N/A" },
  { label: "Gross Revenue", value: "N/A" },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
            <p className="text-xs mb-1" style={{ color: "#8b94b2" }}>{s.label}</p>
            <p className="text-lg font-bold" style={{ color: "#2d3452" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* % Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {
        [
  { label: "Booking Conversion Rate", value: "N/A", sub: null },
  { label: "Booking Cancellation Rate", value: "N/A", sub: null },
  { label: "Booking Rate vs Booking % Rate", value: "N/A", sub: null },

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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>Platform Earnings by Month</p>
          <div className="flex flex-wrap gap-3">
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-bold" style={{ color: "#111827" }}>Revenue By Region</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "50% AND ABOVE", color: tierColors.high },
              { label: "49% OR LESS", color: tierColors.medium },
              { label: "LESS THAN 30%", color: tierColors.low },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="rounded-full" style={{ width: 8, height: 8, background: l.color, display: "block" }} />
                <span className="text-[10px] font-semibold tracking-wide text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-0.5" style={{ height: 520 }}>
          {/* Featured / left region with detail card overlay */}
          <div
            className="relative rounded-lg cursor-pointer overflow-hidden"
            style={{ flexBasis: "32%", background: tierColors.high }}
            onMouseEnter={() => setSelectedRegion(featuredRegion)}
            onClick={() => setSelectedRegion(featuredRegion)}
          >
            <div className="absolute top-4 left-4 right-4 rounded-lg bg-white p-4 shadow-md">
              <p className="text-sm font-bold text-gray-900">Region: {selectedRegion.name}</p>
              <p className="text-sm font-bold text-gray-900">Total Revenue: {selectedRegion.totalRevenue}</p>
              <p className="text-sm font-bold text-gray-900">% of Platform Revenue: {selectedRegion.pctOfPlatform}</p>
              <p className="text-sm font-bold text-gray-900">Top Service: {selectedRegion.topService}</p>
              <p className="text-sm font-bold text-gray-900">Avg. Booking Value: {selectedRegion.avgBookingValue}</p>
            </div>
            <span className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-medium">
              {featuredRegion.name}
            </span>
          </div>

          {/* Treemap grid */}
          <div className="flex flex-1 flex-col gap-1">
            {regionRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-1 gap-0.5 " style={{ flexBasis: `${row.heightPercent}%` }}>
                {row.cells.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="rounded-lg flex items-center  justify-center text-center text-white text-xs font-medium cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                      flexBasis: `${cell.widthPercent}%`,
                      background: tierColors[cell.tier],
                    }}
                    onMouseEnter={() => setSelectedRegion(cell.detail)}
                    onClick={() => setSelectedRegion(cell.detail)}
                  >
                    {cell.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Overview