import { useEffect, useMemo, useState } from "react"
import axios from "../../Config/axiosconfig"
import { Search, SlidersHorizontal, Download, MoreVertical, Wallet, Clock } from "lucide-react"

// ---- Types -----------------------------------------------------------
// Matches the actual /admin/transactions payload:
// { status, message, data: { record_per_page, transactions: [{ id, user, payment_intent_id, status, created_at }] } }
//
// The design calls for several columns (Payment Ref Date, Customer ID, Customer
// Email, Service Type, P. Method, Amount, Commission) and two summary cards
// (Total Payments, Held Payments) that this endpoint doesn't return yet. Those
// render as "N/A" below until the backend adds them — search for "N/A" to see
// every spot that needs a real field wired in later.

type TabKey = "all" | "paid" | "held" | "refunds"

interface TransactionApiRow {
  id: number
  user: string
  payment_intent_id: string
  status: string
  created_at: string
}

interface TransactionsApiResponse {
  status: boolean
  message: string
  data: {
    record_per_page: number
    transactions: TransactionApiRow[]
  }
}

interface PaymentRow {
  id: number
  paymentId: string
  creationDate: string
  refDate: string | null
  customerId: string | null
  customerName: string
  customerEmail: string | null
  serviceType: string | null
  paymentMethod: string | null
  amount: string | null
  commission: string | null
  status: string
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Payments" },
  { key: "paid", label: "Paid" },
  { key: "held", label: "Held" },
  { key: "refunds", label: "Refunds" },
]

// ---- Small UI helpers --------------------------------------------------

// Color-codes whatever status string the API sends (Initiated, Paid, Held,
// Refunded, "Paid out", ...) rather than assuming a fixed set of values.
// "Initiated" reads as an in-progress payment, so it gets its own lighter
// "Processing" treatment instead of the bolder amber used elsewhere.
const STATUS_STYLES: Record<string, { label: string; text: string; dot: string }> = {
  paid: { label: "Paid", text: "text-emerald-600", dot: "bg-emerald-500" },
  held: { label: "Held", text: "text-neutral-800", dot: "bg-neutral-800" },
  "paid out": { label: "Paid out", text: "text-teal-500", dot: "bg-teal-500" },
  refunded: { label: "Refunded", text: "text-teal-500", dot: "bg-teal-500" },
  initiated: { label: "Processing", text: "text-amber-400", dot: "bg-amber-300" },
  failed: { label: "Failed", text: "text-rose-600", dot: "bg-rose-500" },
}

const StatusBadge = ({ status }: { status: string }) => {
  const { label, text, dot } = STATUS_STYLES[status.toLowerCase()] ?? {
    label: status,
    text: "text-neutral-500",
    dot: "bg-neutral-400",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
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

// Small decorative squiggle used under the summary cards, matching the design.
const SparkWave = ({ color }: { color: string }) => (
  <svg viewBox="0 0 120 24" className="mt-2 h-5 w-full" preserveAspectRatio="none">
    <path
      d="M0 16 C 12 4, 24 4, 36 14 S 60 24, 72 12 S 96 2, 108 10 S 118 16, 120 14"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
)

interface SummaryCardProps {
  label: string
  value: string
  circleClass: string
  iconClass: string
  valueClass: string
  waveColor: string
  icon: React.ReactNode
}

const SummaryCard = ({ label, value, circleClass, valueClass, waveColor, icon }: SummaryCardProps) => (
  <div className="flex min-w-55 items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${circleClass}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
      <SparkWave color={waveColor} />
    </div>
  </div>
)

// ---- Main component -----------------------------------------------------

const Payments = () => {
  const token = localStorage.getItem("token")

  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allRows, setAllRows] = useState<PaymentRow[]>([])
  const [recordPerPage, setRecordPerPage] = useState(20)

  const getPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<TransactionsApiResponse>("/admin/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // The API doesn't currently document status/search/page filters —
        // sending them anyway in case the backend already supports them;
        // harmless if ignored, since we also filter client-side below.
        params: {
          status: activeTab === "all" ? undefined : activeTab,
          search: search || undefined,
          page,
        },
      })

      const { transactions, record_per_page } = res.data.data
      setAllRows(
        transactions.map((t) => ({
          id: t.id,
          paymentId: t.payment_intent_id,
          creationDate: t.created_at,
          // Not returned by /admin/transactions yet
          refDate: null,
          customerId: null,
          customerName: t.user,
          customerEmail: null,
          serviceType: null,
          paymentMethod: null,
          amount: null,
          commission: null,
          status: t.status,
        }))
      )
      setRecordPerPage(record_per_page)
    } catch (err) {
      console.error("Failed to load payments:", err)
      setError("Couldn't load payments. Try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    getPayments()
  }

  // Client-side safety net: filter by tab/search in case the API ignored
  // those params (it currently returns the same list regardless).
  const rows = useMemo(() => {
    let result = allRows
    if (activeTab !== "all") {
      result = result.filter((r) => r.status.toLowerCase() === activeTab.toLowerCase())
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (r) => r.customerName.toLowerCase().includes(q) || r.paymentId.toLowerCase().includes(q)
      )
    }
    return result
  }, [allRows, activeTab, search])

  // No total_pages/total_count in this payload, so the summary cards and the
  // "of N pages" label can't be computed accurately from a single page of
  // results — they show N/A until the backend adds aggregate endpoints.
 const totalPaymentsLabel = rows.length.toString()
  const heldPaymentsLabel = "N/A"
  const totalPagesLabel = "N/A"

  const hasNextPage = allRows.length >= recordPerPage
  const pageRangeLabel = useMemo(() => {
    if (!allRows.length) return ""
    const start = (page - 1) * recordPerPage + 1
    const end = start + rows.length - 1
    return `${start} - ${end}`
  }, [allRows.length, page, recordPerPage, rows.length])

  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-xl font-semibold text-neutral-900">Payments overview</h1>

      {/* Summary cards */}
      <div className="flex flex-wrap gap-4">
        <SummaryCard
          label="Total Payments"
          value={totalPaymentsLabel}
          circleClass="bg-blue-50"
          iconClass="text-blue-500"
          valueClass="text-blue-600"
          waveColor="#93c5fd"
          icon={<Wallet size={22} className="text-blue-500" />}
        />
        <SummaryCard
          label="Held Payments"
          value={heldPaymentsLabel}
          circleClass="bg-rose-50"
          iconClass="text-rose-500"
          valueClass="text-rose-600"
          waveColor="#fca5a5"
          icon={<Clock size={22} className="text-rose-500" />}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{TABS.find((t) => t.key === activeTab)?.label}</p>

        <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex overflow-hidden rounded-xl border border-neutral-300 bg-white">
  {TABS.map((tab, index) => (
    <button
      key={tab.key}
      onClick={() => {
        setActiveTab(tab.key)
        setPage(1)
      }}
      className={`
        px-5 py-2 text-sm font-medium transition-all duration-200
        ${
          activeTab === tab.key
            ? "bg-black text-white"
            : "bg-white text-neutral-500 hover:bg-neutral-50"
        }
        ${
          index !== TABS.length - 1
            ? "border-r border-neutral-300"
            : ""
        }
      `}
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
              <SortableHeader label="Payment ID" />
              <SortableHeader label="Payment Creation Date" />
              <SortableHeader label="Payment Ref Date" />
              <SortableHeader label="Customer ID" />
              <SortableHeader label="Customer Name" />
              <SortableHeader label="Customer Email" />
              <SortableHeader label="Service Type" />
              <SortableHeader label="P. Method" />
              <SortableHeader label="Amount" />
              <SortableHeader label="Commission" />
              <SortableHeader label="Status" />
              <th className="w-10 bg-blue-600" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-sm text-neutral-400">
                  Loading payments…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-sm text-rose-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-sm text-neutral-400">
                  No payments found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-100 text-sm">
                  <td className="px-4 py-3 text-neutral-700">  {row.paymentId.slice(0, 9)}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.creationDate}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.refDate ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.customerId ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.customerName}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.customerEmail ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.serviceType ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.paymentMethod ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.amount ?? "N/A"}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.commission ?? "N/A"}</td>
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
          {pageRangeLabel && `${pageRangeLabel} of ${totalPagesLabel} Pages`}
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

export default Payments