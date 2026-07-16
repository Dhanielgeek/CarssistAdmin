import { useEffect, useMemo, useState } from "react"
import axios from "../../Config/axiosconfig"
import { Search, SlidersHorizontal, Download, MoreVertical } from "lucide-react"

// ---- Types -----------------------------------------------------------
// Matches the actual /admin/transactions payload:
// { status, message, data: { record_per_page, transactions: [{ id, user, payment_intent_id, status, created_at }] } }

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
  customerName: string
  creationDate: string
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
const STATUS_STYLES: Record<string, { text: string; dot: string }> = {
  paid: { text: "text-emerald-600", dot: "bg-emerald-500" },
  held: { text: "text-neutral-800", dot: "bg-neutral-800" },
  "paid out": { text: "text-teal-500", dot: "bg-teal-500" },
  refunded: { text: "text-teal-500", dot: "bg-teal-500" },
  initiated: { text: "text-amber-600", dot: "bg-amber-500" },
  failed: { text: "text-rose-600", dot: "bg-rose-500" },
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
          customerName: t.user,
          creationDate: t.created_at,
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

  // No total_pages in this payload — infer whether there's a next page from
  // whether this page came back full.
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">{TABS.find((t) => t.key === activeTab)?.label}</p>

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
              <SortableHeader label="Payment ID" />
              <SortableHeader label="Customer Name" />
              <SortableHeader label="Payment Creation Date" />
              <SortableHeader label="Status" />
              <th className="w-10 bg-blue-600" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-400">
                  Loading payments…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-rose-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-neutral-400">
                  No payments found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-100 text-sm">
                  <td className="px-4 py-3 text-neutral-700">{row.paymentId}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.customerName}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.creationDate}</td>
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

export default Payments