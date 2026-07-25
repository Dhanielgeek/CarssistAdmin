import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import Sparkline from "../../Components/Charts/sparkline"
import SalesMap from "../../Components/Charts/worldmap"
import MultiLineChart from "../../Components/Charts/multilinecharts"
import axios from "../../Config/axiosconfig"

// ─── mock data ──────────────────────────────────────────────────────────────

const wave = (base: number, spread: number, len: number, seed = 1) =>
  Array.from({ length: len }, (_, i) =>
    Math.round(base + Math.sin(i * 0.9 + seed) * spread + (i % 3 === 0 ? spread * 0.3 : 0)),
  )



const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

const customerSeries = months.map((label, i) => ({
  label,
  loyal: 250 + Math.round(Math.sin(i * 0.55) * 90),
  newCustomers: 150 + Math.round(Math.sin(i * 0.5 + 2) * 130 + (i > 8 ? -40 : 0)),
  unique: 220 + Math.round(Math.cos(i * 0.6 + 1) * 110),
}))

const seriesConfig = [
  { key: "loyal", color: "#a855f7", label: "Loyal Customers" },
  { key: "newCustomers", color: "#e5484d", label: "New Customers" },
  { key: "unique", color: "#22c55e", label: "Unique Customers" },
]



// ─── small pieces ───────────────────────────────────────────────────────────


type KpiCardProps = {
  label: string;
  value: string | number;
  color: string;
  spark: number[];
};

function KpiCard({ label, value, color, spark }: KpiCardProps) {
  return (
    <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "#e6f0ff" }} />
        <div>
          <p className="text-lg font-bold leading-tight" style={{ color }}>
            {value}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "#8b94b2" }}>
            {label}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <Sparkline data={spark} color={color === "#e5484d" ? "#e5484d" : "#0057b8"} width={140} />
      </div>
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

const tabs = [
  { key: "assist", label: "Assist" },
  { key: "chauffeur", label: "Chauffeur" },
] as const

type TabKey = (typeof tabs)[number]["key"]

const FinancalReports = () => {
  const [tab, setTab] = useState<TabKey>("assist")


 const token = localStorage.getItem("token");

const [analytics, setAnalytics] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


console.log(error, loading);


const getAnalytics = async () => {
  try {
    setLoading(true);

    const res = await axios.get("/admin/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.status) {
      setAnalytics(res.data.data);
    }
  } catch (err) {
    console.error(err);
    setError("Failed to fetch analytics");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  getAnalytics();
}, []);



const kpiCards = [
  {
    label: "Total Revenue",
    value: analytics?.total_revenue ?? "N/A",
    color: "#0057b8",
    spark: wave(50, 20, 10, 1),
  },
  {
    label: "Average Revenue Per Service",
    value:
      analytics?.total_bookings && analytics?.total_revenue
        ? (
            Number(
              analytics.total_revenue.replace("$", "")
            ) / analytics.total_bookings
          ).toFixed(2)
        : "N/A",
    color: "#e5484d",
    spark: wave(45, 22, 10, 2),
  },
  {
    label: "Total Payouts",
    value: "N/A", // until backend provides it
    color: "#0057b8",
    spark: wave(55, 18, 10, 3),
  },
  {
    label: "Outstanding Payments",
    value: "N/A", // until backend provides it
    color: "#0057b8",
    spark: wave(40, 20, 10, 4),
  },
];

  return (
    <div className="flex flex-col gap-5 mt-2 px-3">
      {/* ── tabs ── */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1.5 rounded-md text-sm font-medium"
            style={
              tab === t.key
                ? { background: "#14161f", color: "#fff" }
                : { background: "#fff", color: "#2d3452", border: "1px solid #eaecf3" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>
        {tabs.find((t) => t.key === tab)?.label} Service Financial Metrics
      </p>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── map + chart ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <SalesMap />

        <div className="rounded-xl p-5 bg-white shadow-sm border flex flex-col" style={{ borderColor: "#eaecf3" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>
              Loyal vs New vs Unique Customers
            </p>
            <ChevronDown size={16} color="#8b94b2" className="cursor-pointer" />
          </div>

          <MultiLineChart
            data={customerSeries}
            series={seriesConfig}
            markers={[{ index: 5, seriesKey: "newCustomers", color: "#e5484d" }]}
            tooltip={(pt) => (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2" style={{ background: "#a855f7" }} />
                  {pt.loyal}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2" style={{ background: "#22c55e" }} />
                  {pt.unique}
                </div>
              </>
            )}
          />

          <div className="flex items-center gap-5 mt-4 justify-center flex-wrap">
            {seriesConfig.map((s) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5" style={{ background: s.color }} />
                <span className="text-xs" style={{ color: "#8b94b2" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancalReports