import { useEffect, useState, type ReactNode } from "react"
import Sparkline from "../../Components/Charts/sparkline"
import DualLineChart from "../../Components/Charts/linechart"
import axios from "../../Config/axiosconfig"

// ─── mock data ──────────────────────────────────────────────────────────────

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const timeSlots = ["12 -9am", "5-10am", "10-2pm", "2-6pm", "6-9pm", "9-12am"]

const wave = (base: number, spread: number, len: number, seed = 1): number[] =>
  Array.from({ length: len }, (_, i) =>
    Math.round(base + Math.sin(i * 0.9 + seed) * spread + (i % 3 === 0 ? spread * 0.3 : 0)),
  )



const newVsRepeat = months.map((label, i) => ({
  label,
  a: 30 + Math.round(Math.sin(i * 0.8) * 25 + 35),
  b: 25 + Math.round(Math.cos(i * 0.6) * 20 + 25),
  repeat: 8 + (i % 5) * 2,
  riders: 55 + (i % 4) * 3,
}))

const peakVsOffPeak = timeSlots.map((label, i) => ({
  label,
  a: 30 + Math.round(Math.sin(i * 1.1) * 25 + 30),
  b: 20 + Math.round(Math.cos(i * 0.9) * 15 + 20),
}))

const onTimeVsDelayed = months.map((label, i) => ({
  label,
  a: 35 + Math.round(Math.sin(i * 0.7 + 1) * 25 + 30),
  b: 20 + Math.round(Math.cos(i * 0.5 + 1) * 18 + 20),
}))

const newVsExperienced = months.map((label, i) => ({
  label,
  a: 32 + Math.round(Math.sin(i * 0.85 + 2) * 25 + 28),
  b: 22 + Math.round(Math.cos(i * 0.65 + 2) * 18 + 22),
}))

// ─── small pieces ───────────────────────────────────────────────────────────

type KpiCardProps = {
  label: string;
  value: string | number;
  color: string;
  spark: number[];
};

function KpiCard({ label, value, color, spark }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-4 bg-white shadow-sm border"
      style={{ borderColor: "#eaecf3" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full shrink-0"
          style={{ background: "#e6f0ff" }}
        />
        <div>
          <p className="text-lg font-bold leading-tight" style={{ color }}>
            {value}
          </p>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "#8b94b2" }}
          >
            {label}
          </p>
        </div>
      </div>

      <div className="mt-2">
        <Sparkline
          data={spark}
          color={color === "#e5484d" ? "#e5484d" : "#0057b8"}
          width={140}
        />
      </div>
    </div>
  );
}


type ChartCardProps = {
  title: string
  showMonthly?: boolean
  children: ReactNode
}

function ChartCard({ title, showMonthly, children }: ChartCardProps) {
  return (
    <div className="rounded-xl p-5 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>{title}</p>
        {showMonthly && (
          <div
            className="text-xs px-2.5 py-1 rounded-md border flex items-center gap-1 cursor-pointer"
            style={{ color: "#0057b8", borderColor: "#dbe4f3" }}
          >
            Monthly
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

export default function PerformanceReport() {
  const [tab, setTab] = useState("assist")



  const token = localStorage.getItem("token")


const [analytics, setAnalytics] = useState<any>(null);
const [bookings, setBookings] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

console.log(loading);




const pendingRequests = bookings.filter(
  (booking) =>
    booking.status?.toLowerCase() === "pending" || booking.status === ""
).length;

const getRequest = async () => {
  try {
    setLoading(true);

    const res = await axios.get("/admin/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setBookings(res.data.data.bookings || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

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
  getRequest();
}, []);


const kpiCards = [
  {
    label: "Total Requests",
    value: analytics?.total_bookings ?? "N/A",
    color: "#0057b8",
    spark: wave(50, 20, 10, 1),
  },
  {
    label: "Completed Requests",
    value: analytics?.completed_jobs ?? "N/A",
    color: "#e5484d",
    spark: wave(45, 22, 10, 2),
  },
  {
    label: "Average Response Time",
    value: "N/A",
    color: "#0057b8",
    spark: wave(55, 18, 10, 3),
  },
  {
    label: "Pending Requests",
    value: pendingRequests || "N/A",
    color: "#0057b8",
    spark: wave(40, 20, 10, 4),
  },
  {
    label: "In-Progress Requests",
    value: "N/A",
    color: "#0057b8",
    spark: wave(48, 20, 10, 5),
  },
  {
    label: "Average Resolution Time",
    value: "N/A",
    color: "#e5484d",
    spark: wave(42, 18, 10, 6),
  },
  {
    label: "Cancelled Requests",
    value: "N/A",
    color: "#0057b8",
    spark: wave(38, 16, 10, 7),
  },
  {
    label: "Repeated Requests",
    value: "N/A",
    color: "#0057b8",
    spark: wave(52, 20, 10, 8),
  },
];

  return (
    <div className="flex flex-col gap-5 mt-6 px-2">
      {/* ── tabs ── */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("assist")}
          className="px-4 py-1.5 rounded-md text-sm font-medium"
          style={
            tab === "assist"
              ? { background: "#14161f", color: "#fff" }
              : { background: "#fff", color: "#2d3452", border: "1px solid #eaecf3" }
          }
        >
          Assist
        </button>
        <button
          onClick={() => setTab("Chaffeur")}
          className="px-4 py-1.5 rounded-md text-sm font-medium"
          style={
            tab === "Chaffeur"
              ? { background: "#14161f", color: "#fff" }
              : { background: "#fff", color: "#2d3452", border: "1px solid #eaecf3" }
          }
        >
      Chaffeur
        </button>
      </div>

      <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>
        {tab === "assist" ? "Assist Service Performance Metrics" : "Chaffeur Performance Metrics"}
      </p>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── charts grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Service Requests: New vs. Repeat" showMonthly>
          <DualLineChart
            data={newVsRepeat as any}
            colorA="#0057b8"
            colorB="#22c55e"
            tooltip={(pt: any) => (
              <>
                {pt.a} New
                <br />
                {pt.repeat} Repeat
                <br />
                {pt.riders} Riders
                <br />
                {pt.label}
              </>
            )}
          />
        </ChartCard>

        <ChartCard title="Response Time: Peak Hours vs. Off-Peak Hours">
          <DualLineChart
            data={peakVsOffPeak as any}
            colorA="#0057b8"
            colorB="#22c55e"
            tooltip={(pt) => <>ART: {pt.a}MINS</>}
          />
        </ChartCard>

        <ChartCard title="Service Completion: On-Time vs. Delayed" showMonthly>
          <DualLineChart
            data={onTimeVsDelayed as any}
            colorA="#0057b8"
            colorB="#22c55e"
            tooltip={(pt) => (
              <>
                {pt.a} ONTIME
                <br />
                {pt.b} DELAYED
                <br />
                {pt.label}
              </>
            )}
          />
        </ChartCard>

        <ChartCard title="ART: New Providers vs. Experienced Providers">
          <DualLineChart
            data={newVsExperienced as any}
            colorA="#0057b8"
            colorB="#22c55e"
            tooltip={(pt) => (
              <>
                {pt.b} EP
                <br />
                {pt.a} NP
                <br />
                {pt.label}
              </>
            )}
          />
        </ChartCard>
      </div>
    </div>
  )
}