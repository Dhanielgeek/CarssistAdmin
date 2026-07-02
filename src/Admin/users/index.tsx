import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  MoreVertical,
  Check,
} from "lucide-react"

// ─── types & mock data ──────────────────────────────────────────────────────

type Status = "Active" | "Inactive" | "Guest"

type UserRow = {
  id: string
  regDate: string
  userId: string
  name: string
  email: string
  phone: string
  country: string
  state: string
  serviceArea: string
  accountType: "Motorist" | "Service P."
  requests: number
  avgRating: string
  lastLogin: string
  status: Status
}

const lastLogins = [
  "Today",
  "Yesterday",
  "Today",
  "Three days ago",
  "A week ago",
  "A Month Ago",
  "13/04/2024",
  "Today",
  "13/04/2024",
  "Today",
  "Today",
  "13/04/2024",
  "Today",
  "Today",
]

const statuses: Status[] = [
  "Active",
  "Active",
  "Guest",
  "Inactive",
  "Active",
  "Inactive",
  "Active",
  "Active",
  "Inactive",
  "Active",
  "Active",
  "Inactive",
  "Active",
  "Inactive",
]

const rows: UserRow[] = Array.from({ length: 14 }, (_, i) => ({
  id: `row-${i}`,
  regDate: "12/04/2024",
  userId: "123456789",
  name: "James Adeleke",
  email: "Jamesadeleke@gmail.com",
  phone: "+124678809872",
  country: "USA",
  state: "Texas",
  serviceArea: i < 6 ? "" : "Texas Frisco",
  accountType: i < 6 ? "Motorist" : "Service P.",
  requests: i === 2 ? 1 : 25,
  avgRating: "40%",
  lastLogin: lastLogins[i],
  status: statuses[i],
}))

const columns = [
  { key: "regDate", label: "Reg Date" },
  { key: "userId", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone No" },
  { key: "country", label: "Country" },
  { key: "state", label: "State" },
  { key: "serviceArea", label: "Service Area" },
  { key: "accountType", label: "Account Type" },
  { key: "requests", label: "Requests" },
  { key: "avgRating", label: "Average Rating" },
  { key: "lastLogin", label: "Last Login" },
  { key: "status", label: "AC Status" },
] as const

const statusColor: Record<Status, string> = {
  Active: "#0057b8",
  Inactive: "#e5484d",
  Guest: "#e8a838",
}

// ─── small pieces ───────────────────────────────────────────────────────────

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="w-4 h-4 rounded flex items-center justify-center shrink-0"
      style={{
        background: checked ? "#0057b8" : "#fff",
        border: checked ? "none" : "1.5px solid #cbd3e1",
      }}
    >
      {checked && <Check size={11} color="#fff" strokeWidth={3} />}
    </button>
  )
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor[status] }} />
      <span className="text-xs font-medium" style={{ color: statusColor[status] }}>
        {status}
      </span>
    </div>
  )
}

function RowMenu({ status, onClose }: { status: Status; onClose: () => void }) {
  const options =
    status === "Guest"
      ? ["View User", "Download All User Data"]
      : ["View User", status === "Active" ? "Deactivate User" : "Activate User", "Download All User Data"]

  return (
    <div
      className="absolute right-6 z-30 w-44 rounded-lg bg-white border shadow-lg py-1 text-xs"
      style={{ borderColor: "#eaecf3", color: "#2d3452" }}
      onMouseLeave={onClose}
    >
      {options.map((opt) => (
        <button
          key={opt}
          className="w-full text-left px-3 py-2 hover:bg-[#f5f7fb]"
          onClick={onClose}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 14
const TOTAL_ROWS = 40

const MainUsers = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set(rows.slice(0, 6).map((r) => r.id)))
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const allChecked = selected.size === rows.length
  const someChecked = selected.size > 0 && !allChecked

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(rows.map((r) => r.id)))
  }

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredRows = query
    ? rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.email.toLowerCase().includes(query.toLowerCase()))
    : rows

  const rangeStart = (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, TOTAL_ROWS)

  return (
    <div className="flex flex-col gap-4">
      {/* ── header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm" style={{ color: "#4a5474" }}>
          All Carssist Customers who request assistance or Chauffeur Service including motorists
        </p>

        <div className="flex items-center gap-2 ml-auto">
          <div
            className="flex items-center gap-2 rounded-md border px-3 py-2 w-64"
            style={{ borderColor: "#e2e6ee" }}
          >
            <Search size={15} color="#8b94b2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="text-xs w-full outline-none"
              style={{ color: "#2d3452" }}
            />
          </div>

          <button
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium"
            style={{ borderColor: "#e2e6ee", color: "#2d3452" }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <button
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium"
            style={{ borderColor: "#e2e6ee", color: "#2d3452" }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ── table ── */}
      <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: "#eaecf3" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr style={{ background: "#0057b8" }}>
                <th className="px-4 py-3 w-10">
                  <Checkbox checked={allChecked} onChange={toggleAll} />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-3 text-left font-semibold text-white whitespace-nowrap">
                    <div className="flex items-center gap-1 cursor-pointer">
                      {col.label}
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const isChecked = selected.has(row.id)
                const isGuest = row.status === "Guest"
                return (
                  <tr
                    key={row.id}
                    className="border-b relative"
                    style={{
                      borderColor: "#f0f2f7",
                      background: isChecked ? "#eaf3ff" : "#fff",
                    }}
                  >
                    <td className="px-4 py-3">
                      <Checkbox checked={isChecked} onChange={() => toggleRow(row.id)} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.regDate}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.userId}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.name}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.email}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.phone}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.country}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.state}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.serviceArea}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.accountType}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.requests}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.avgRating}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap" style={{ color: isGuest ? "#c3c9d6" : "#2d3452" }}>
                      {row.lastLogin}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
                        className="text-[#8b94b2] hover:text-[#2d3452]"
                      >
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === row.id && (
                        <RowMenu status={row.status} onClose={() => setOpenMenu(null)} />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── pagination ── */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "#8b94b2" }}>
          {rangeStart} - {rangeEnd} of {TOTAL_ROWS} Pages
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            style={{ borderColor: "#e2e6ee", color: "#2d3452" }}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => (rangeEnd < TOTAL_ROWS ? p + 1 : p))}
            disabled={rangeEnd >= TOTAL_ROWS}
            className="rounded-md border px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            style={{ borderColor: "#e2e6ee", color: "#2d3452" }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainUsers