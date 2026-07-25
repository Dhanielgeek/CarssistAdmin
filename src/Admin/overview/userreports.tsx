import { useEffect, useState } from "react"
import { Star, User as UserIcon } from "lucide-react"
import Sparkline from "../../Components/Charts/sparkline"
import CarThumb from "../../Components/carthumb"
import axios from "../../Config/axiosconfig"

// ─── mock data ──────────────────────────────────────────────────────────────

const wave = (base: number, spread: number, len: number, seed = 1) =>
  Array.from({ length: len }, (_, i) =>
    Math.round(base + Math.sin(i * 0.9 + seed) * spread + (i % 3 === 0 ? spread * 0.3 : 0)),
  )



const carColors = ["#9aa3b8", "#f3f5f9", "#e5484d"]

type LeaderRow = {
  name: string
  rating: number
  countLabel: string
  id: string
  regDate: string
  lastLogin: string
  chauffeurCount: number
  assistCount: number
  carColor: string
}

const makeRows = (countLabel: string, names: string[]): LeaderRow[] =>
  names.map((name, i) => ({
    name,
    rating: 4.6,
    countLabel,
    id: `1234${5 + i}`,
    regDate: "January 15, 2023",
    lastLogin: "May 29, 2024, 14:35",
    chauffeurCount: 10 + i,
    assistCount: 20 + i,
    carColor: carColors[i],
  }))

const topCustomers = makeRows("23 Assists", ["James Adeleke", "Grace Okafor", "Tunde Bakare"])
const topProviders = makeRows("23 Assists", ["Femi Alabi", "Chidinma Eze", "Yusuf Bello"])
const topChauffeurRiders = makeRows("23 Rides", ["Ada Nwosu", "Kunle Ajayi", "Ngozi Umeh"])

// ─── small pieces ───────────────────────────────────────────────────────────



type KpiCardProps = {
  label: string
  value: string | number
  color: string
  spark: number[]
}

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

function DetailTooltip({ row }: { row: LeaderRow }) {
  return (
    <div
      className="absolute z-20 left-14 -top-2 w-52 rounded-lg bg-white border shadow-lg p-3 text-[11px] leading-relaxed pointer-events-none"
      style={{ borderColor: "#eaecf3", color: "#4a5474" }}
    >
      <p className="font-semibold text-[12px] mb-1" style={{ color: "#2d3452" }}>
        {row.name}
      </p>
      <p>ID: {row.id}</p>
      <p>Registration date: {row.regDate}</p>
      <p>Last login: {row.lastLogin}</p>
      <p>
        Chauffeur: {row.chauffeurCount}, Assist: {row.assistCount}
      </p>
    </div>
  )
}

function LeaderboardRow({ row }: { row: LeaderRow }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative flex flex-col gap-1.5 py-2 border-b last:border-b-0"
      style={{ borderColor: "#f0f2f7" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-9 shrink-0">
          <CarThumb color={row.carColor} />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Star size={13} fill="#e8a838" stroke="#e8a838" />
          <span className="text-xs font-semibold" style={{ color: "#2d3452" }}>
            {row.rating}
          </span>
        </div>

        <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#dbe4f3" }}>
          <UserIcon size={16} color="#5b6b8c" />
        </div>
      </div>

      <span className="text-[11px]" style={{ color: "#8b94b2" }}>
        {row.countLabel}
      </span>

      {hovered && <DetailTooltip row={row} />}
    </div>
  )
}

function LeaderboardColumn({ title, rows }: { title: string; rows: LeaderRow[] }) {
  return (
    <div className="rounded-xl p-4 bg-white shadow-sm border" style={{ borderColor: "#eaecf3" }}>
      <p className="text-sm font-semibold mb-2" style={{ color: "#2d3452" }}>
        {title}
      </p>
      {rows.map((row) => (
        <LeaderboardRow key={row.id} row={row} />
      ))}
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

const tabs = [
  { key: "assist", label: "Assist" },
  { key: "chauffeur", label: "Chauffeur" },
  { key: "motorist", label: "Motorist" },
] as const

type TabKey = (typeof tabs)[number]["key"]

const UserReports = () => {
  const [tab, setTab] = useState<TabKey>("assist")


  const token = localStorage.getItem("token");

const [analytics, setAnalytics] = useState<any>(null);
const [users, setUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

console.log(loading);


  

const getAllUsers = async () => {
  try {
    setLoading(true);

    const res = await axios.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data.data.users || []);
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
    console.error(error);
  }
};

useEffect(()=>{
  getAllUsers()
  getAnalytics()
},[])


const activeUsers = users.filter(
  (user) => user.status?.toLowerCase() === "active"
).length;

const inactiveUsers = users.filter(
  (user) => user.status?.toLowerCase() === "inactive"
).length;

const newUsers = users.length;

const kpiCards = [
  {
    label: "Total Users",
    value: analytics?.total_users ?? "N/A",
    color: "#0057b8",
    spark: wave(50, 20, 10, 1),
  },
  {
    label: "Average Revenue Per Service",
    value: "N/A",
    color: "#e5484d",
    spark: wave(45, 22, 10, 2),
  },
  {
    label: "New Users",
    value: users.length ? newUsers : "N/A",
    color: "#0057b8",
    spark: wave(55, 18, 10, 3),
  },
  {
    label: "Active Users",
    value: users.length ? activeUsers : "N/A",
    color: "#0057b8",
    spark: wave(40, 20, 10, 4),
  },
  {
    label: "User Retention Rate",
    value: "N/A",
    color: "#0057b8",
    spark: wave(48, 20, 10, 5),
  },
  {
    label: "Churn Rate",
    value: users.length ? inactiveUsers : "N/A",
    color: "#e5484d",
    spark: wave(42, 18, 10, 6),
  },
  {
    label: "Average Session Duration",
    value: "N/A",
    color: "#0057b8",
    spark: wave(38, 16, 10, 7),
  },
];






  return (
    <div className="flex flex-col gap-5 mt-6 px-4">
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
        {tabs.find((t) => t.key === tab)?.label} Service Provider User Metrics
      </p>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── leaderboards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeaderboardColumn title="Top 3 Customers" rows={topCustomers} />
        <LeaderboardColumn title="Top 3 Assist Providers" rows={topProviders} />
        <LeaderboardColumn title="Top 3 Chauffeur Riders" rows={topChauffeurRiders} />
      </div>
    </div>
  )
}

export default UserReports