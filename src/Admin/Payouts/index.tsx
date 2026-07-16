import { useEffect, useMemo, useState } from "react"
import axios from "../../Config/axiosconfig"
import { Search, SlidersHorizontal, Download, MoreVertical, Wallet, Clock } from "lucide-react"



type TabKey = "all" | "pending"

interface PayoutRow {
  payoutId: string
  payoutDate: string
  spId: string
  spName: string
  spEmail: string
  amount: number
  totalCommission: number
  status: "Paid Out" | "Pending"
}

interface PayoutsApiResponse {
  status: boolean
  message: string
  data: {
    record_per_page: number
    total_payouts?: number
    pending_payouts?: number
    payouts: {
      id: string
      payout_date: string
      sp_id: string
      sp_name: string
      sp_email: string
      amount: number
      total_commission: number
      status: string
    }[]
  }
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Payouts" },
  { key: "pending", label: "Pending" },
]

// ---- Small UI helpers --------------------------------------------------

const money = (n: number) => `$${n.toLocaleString()}`

const STATUS_STYLES: Record<string, { text: string; dot: string }> = {
  "paid out": { text: "text-emerald-600", dot: "bg-emerald-500" },
  pending: { text: "text-neutral-800", dot: "bg-neutral-800" },
}

const StatusBadge = ({ status }: { status: string }) => {
  const { text, dot } = STATUS_STYLES[status.toLowerCase()] ?? {
    text: "text-neutral-500",
    dot: "bg-neutral-400",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}

const SortableHeader = ({ label }: { label: string }) => (
  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-white">
    <span className="inline-flex items-center gap-1">
      {label}
      <span className="text-[10px] opacity-80">▾</span>
    </span>
  </th>
)

const StatCard = ({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: string
  label: string
  tone: "blue" | "rose"
}) => {
  const toneMap = {
    blue: { bg: "bg-blue-50", ring: "bg-blue-100", text: "text-blue-600" },
    rose: { bg: "bg-rose-50", ring: "bg-rose-100", text: "text-rose-500" },
  }[tone]
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-neutral-100 ${toneMap.bg} px-5 py-4`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${toneMap.ring} ${toneMap.text}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xl font-semibold ${toneMap.text}`}>{value}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  )
}

// ---- Main component -----------------------------------------------------

const Payouts = () => {
  const token = localStorage.getItem("token")

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<PayoutRow[]>([])
  const [totalPayouts, setTotalPayouts] = useState<number | null>(null)
  const [pendingPayouts, setPendingPayouts] = useState<number | null>(null)
  const [recordPerPage, setRecordPerPage] = useState(20)

  const getPayouts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<PayoutsApiResponse>("/admin/payouts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: activeTab === "all" ? undefined : activeTab,
          search: search || undefined,
          page,
        },
      })

      const { payouts, record_per_page, total_payouts, pending_payouts } = res.data.data
      setRows(
        payouts.map((p) => ({
          payoutId: p.id,
          payoutDate: p.payout_date,
          spId: p.sp_id,
          spName: p.sp_name,
          spEmail: p.sp_email,
          amount: p.amount,
          totalCommission: p.total_commission,
          status: p.status as PayoutRow["status"],
        }))
      )
      setRecordPerPage(record_per_page)
      setTotalPayouts(total_payouts ?? null)
      setPendingPayouts(pending_payouts ?? null)
    } catch (err) {
      console.error("Failed to load payouts:", err)
      setError("Couldn't load payouts. Try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPayouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    getPayouts()
  }

  const hasNextPage = rows.length >= recordPerPage
  const pageRangeLabel = useMemo(() => {
    if (!rows.length) return ""
    const start = (page - 1) * recordPerPage + 1
    const end = start + rows.length - 1
    return `${start} - ${end}`
  }, [rows.length, page, recordPerPage])

  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-xl font-semibold text-neutral-900">Payouts overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-xl">
        <StatCard
          icon={<Wallet size={18} />}
          value={totalPayouts !== null ? `${totalPayouts}+` : "—"}
          label="Total Payouts"
          tone="blue"
        />
        <StatCard
          icon={<Clock size={18} />}
          value={pendingPayouts !== null ? `${pendingPayouts}+` : "—"}
          label="Pending Payouts"
          tone="rose"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">All Payouts Made</p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-neutral-100 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setPage(1)
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-56 rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-neutral-400"
            />
          </form>

          <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600">
              <SortableHeader label="Payout ID" />
              <SortableHeader label="Payout Date" />
              <SortableHeader label="Sp ID" />
              <SortableHeader label="Sp Name" />
              <SortableHeader label="Sp Email" />
              <SortableHeader label="Amount" />
              <SortableHeader label="Total Commission" />
              <SortableHeader label="Status" />
              <th className="w-10 bg-blue-600" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-neutral-400">
                  Loading payouts…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-rose-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-neutral-400">
                  No payouts found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((row, i) => (
                <tr key={`${row.payoutId}-${i}`} className="border-t border-neutral-100 text-sm">
                  <td className="px-4 py-3 text-neutral-700">{row.payoutId}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.payoutDate}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.spId}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.spName}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.spEmail}</td>
                  <td className="px-4 py-3 text-neutral-700">{money(row.amount)}</td>
                  <td className="px-4 py-3 text-neutral-700">{money(row.totalCommission)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    <MoreVertical size={16} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          {pageRangeLabel && `Showing ${pageRangeLabel}`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payouts