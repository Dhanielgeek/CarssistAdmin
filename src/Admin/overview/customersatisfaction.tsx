import { useState } from "react"
import Sparkline from "../../Components/Charts/sparkline"
import DualLineChart from "../../Components/Charts/linechart"
import SentimentPanel from "../../Components/Charts/sentimentpanel"

// ─── mock data ──────────────────────────────────────────────────────────────

const wave = (base: number, spread: number, len: number, seed = 1) =>
  Array.from({ length: len }, (_, i) =>
    Math.round(base + Math.sin(i * 0.9 + seed) * spread + (i % 3 === 0 ? spread * 0.3 : 0)),
  )

const kpiCards = [
  { label: "Average Rating", value: "178+", color: "#0057b8", spark: wave(50, 20, 10, 1) },
  { label: "Active Users", value: "178+", color: "#0057b8", spark: wave(45, 22, 10, 2) },
  { label: "User Retention Rate", value: "178+", color: "#0057b8", spark: wave(55, 18, 10, 3) },
  { label: "Churn Rate", value: "178+", color: "#e5484d", spark: wave(40, 20, 10, 4) },
  { label: "User Engagement Rate", value: "178+", color: "#0057b8", spark: wave(48, 20, 10, 5) },
  { label: "Average Session Duration", value: "178+", color: "#0057b8", spark: wave(42, 18, 10, 6) },
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const makeCancellationData = (seed: number) =>
  months.map((label, i) => ({
    label,
    a: 30 + Math.round(Math.sin(i * 0.8 + seed) * 25 + 35),
    b: 25 + Math.round(Math.cos(i * 0.6 + seed) * 20 + 25),
    cancelled: 55,
    customers: 45,
    riders: 15,
  }))

const rowData = [
  { chart: makeCancellationData(1), sentiment: { total: "300k R$", positive: 82, neutral: 50, negative: 18 } },
  { chart: makeCancellationData(3), sentiment: { total: "300k R$", positive: 78, neutral: 52, negative: 22 } },
]

// ─── small pieces ───────────────────────────────────────────────────────────

function KpiCard({ label, value, color, spark }: (typeof kpiCards)[number]) {
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

function CancellationCard({ data }: { data: ReturnType<typeof makeCancellationData> }) {
  return (
    <div className="rounded-xl p-5 bg-white shadow-sm border h-full" style={{ borderColor: "#eaecf3" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: "#2d3452" }}>
        Cancellation Rate: User-Initiated vs. Provider-Initiated
      </p>
      <DualLineChart
        data={data}
        colorA="#a855f7"
        colorB="#e5484d"
        tooltip={(pt: any) => (
          <>
            {pt.cancelled} Cancelled
            <br />
            {pt.customers} Customers
            <br />
            {pt.riders} Riders
          </>
        )}
      />
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

const tabs = [
  { key: "assist", label: "Assist" },
  { key: "chauffeur", label: "Chauffeur" },
] as const

type TabKey = (typeof tabs)[number]["key"]

const CustomerSatisfaction = () => {
  const [tab, setTab] = useState<TabKey>("assist")

  return (
    <div className="flex flex-col gap-5 px-5 mt-3">
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
        {tabs.find((t) => t.key === tab)?.label} Service Provider Customer Satisfaction Metrics
      </p>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpiCards.map((c) => (
          <KpiCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── cancellation + sentiment rows ── */}
      {rowData.map((row, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <CancellationCard data={row.chart} />
          <SentimentPanel
            totalLabel={row.sentiment.total}
            positive={{ value: row.sentiment.positive, reviews: "100k" }}
            neutral={{ value: row.sentiment.neutral, reviews: "100k" }}
            negative={{ value: row.sentiment.negative, reviews: "100k" }}
          />
        </div>
      ))}
    </div>
  )
}

export default CustomerSatisfaction