import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  Download,
  ArrowUpDown,
  MoreVertical,
  Check,
  X,
} from "lucide-react"
import axios from '../../Config/axiosconfig'
import {useEffect } from 'react'
import { parsePhoneNumber } from "libphonenumber-js";
import flags from "react-phone-number-input/flags";

// ─── types & mock data ──────────────────────────────────────────────────────

type Status = "Active" | "Inactive" | "Guest"

type UserRow = {
  id: string
  created_at: string
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
  created_at: "12/04/2024",
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

const accountTypeLabel: Record<UserRow["accountType"], string> = {
  Motorist: "Motorist",
  "Service P.": "Service Provider (Chauffeur)",
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

function RowMenu({
  status,
  onClose,
  onViewUser,
}: {
  status: Status
  onClose: () => void
  onViewUser: () => void
}) {
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
          onClick={() => {
            if (opt === "View User") {
              onViewUser()
            }
            onClose()
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}


function PhoneWithFlag({ phone }: { phone?: string }) {
  if (!phone) {
    return (
      <input
        readOnly
        value=""
        className="w-full rounded-full border border-[#E9E9E9] px-4 py-3 text-sm"
      />
    );
  }

  let country: string | undefined;

  try {
    country = parsePhoneNumber(phone)?.country;
  } catch {}

  const Flag =
    country && flags[country as keyof typeof flags]
      ? flags[country as keyof typeof flags]
      : null;

  return (
    <div className="flex items-center gap-3 rounded-full border border-[#E9E9E9] px-4 py-3">
      {Flag ? (
  <div className="flex h-5 w-7 items-center justify-center overflow-hidden rounded-sm">
  <Flag title={country ?? ""} />
</div>
      ) : (
        <div className="w-7 h-5 rounded bg-gray-200" />
      )}

      <input
        readOnly
        value={phone}
        className="flex-1 bg-transparent outline-none text-sm"
      />
    </div>
  );
}

// ─── user detail modal ──────────────────────────────────────────────────────

const TABS = [
  "Overview",
  "Personal Information",
  "Service History",
  "Feedback and Ratings",
  "Payment",
  "Payouts",
] as const

function UserDetailModal({ user, onClose }: { user: UserRow; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview")

  const isServiceProvider = user.accountType === "Service P."

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh]  flex flex-col rounded-md bg-white border-2 p-6"
        style={{ borderColor: "#0057b8" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#2d3452" }}>
          {user.name} ({isServiceProvider ? "Service Provider" : "Motorist"})
        </h2>

    {/* Tabs */}
<div
  className="inline-flex items-center rounded-full border mb-6"
  style={{ borderColor: "#979797" }}
>
  {TABS.map((tab, idx) => (
    <div key={tab} className="flex items-center">
      {idx > 0 && (
        <span className="h-4 w-px" style={{ background: "#e2e6ee" }} />
      )}
      <button
        onClick={() => setActiveTab(tab)}
        className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-md"
        style={
          activeTab === tab
            ? { background: "#0f172a", color: "#fff" }
            : { background: "transparent", color: "#8b94b2" }
        }
      >
        {tab}
      </button>
    </div>
  ))}
</div>

    {/* Content */}
<div className="overflow-y-auto flex-1 pr-2">
  {activeTab === "Overview" ? (
    <div className="flex flex-col gap-5">
      <img
        src={`https://i.pravatar.cc/150?u=${user.id}`}
        alt={user.name}
        className="w-24 h-24 rounded-md object-cover"
        style={{ background: "#c9b8e8" }}
      />

      <div className="flex flex-col gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-700">Full Name</p>
          <p className="text-slate-500">{user.name}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">Account Type</p>
          <p className="text-slate-500">
            {accountTypeLabel[user.accountType]}
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">Email Address</p>
          <p className="text-slate-500">{user.email}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">Account Status</p>
          <p className="text-slate-500">{user.status}</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">Registration Date</p>
          <p className="text-slate-500">
            {user.created_at  || "N/A"}
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-700">Phone Number</p>
          <p className="text-slate-500">{user.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  ) : activeTab === "Personal Information" ? (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-4">
        <div>
       
          <input
            readOnly
            value={user.name?.split(" ")[0] || ""}
            className="w-full rounded-full border border-[#E9E9E9] px-4 py-3 text-sm"
          />
        </div>

        <div>
      
          <input
            readOnly
            value={user.name?.split(" ").slice(1).join(" ") || ""}
            className="w-full rounded-full border border-[#E9E9E9] px-4 py-3 text-sm"
          />
        </div>

        <div>
         
      <PhoneWithFlag phone={user.phone} />
        </div>

        <div>
        
          <input
            readOnly
            value={user.email || ""}
            className="w-full rounded-full border border-[#E9E9E9] px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-2">
            Registration Date
          </label>
          <input
            readOnly
            value={user.created_at  || ""}
            className="w-full rounded-full border border-[#E9E9E9] px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="w-full md:w-64">
        <label className="block text-xs font-semibold mb-2">
          Account Status
        </label>

        <select
          value={user.status}
          disabled
          className="w-full rounded-md border border-[#E9E9E9] px-3 py-2 bg-white"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
    </div>
  ) : activeTab === "Service History" ? (
    <div>
      <h3 className="font-semibold text-sm mb-4">Service History</h3>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-slate-50 p-3 text-xs font-semibold">
          <div>Date</div>
          <div>Service</div>
          <div>Status</div>
          <div>Amount</div>
        </div>

        <div className="py-10 text-center text-slate-400 text-sm">
          No service history available.
        </div>
      </div>
    </div>
  ) : activeTab === "Feedback and Ratings" ? (
    <div className="border rounded-lg p-10 text-center">
      <div className="text-5xl mb-4">⭐</div>

      <h3 className="font-semibold text-lg">No Ratings Yet</h3>

      <p className="text-slate-400 mt-2">
        This user has not received any ratings or feedback.
      </p>
    </div>
  ) : activeTab === "Payment" ? (
    <div>
      <h3 className="font-semibold text-sm mb-4">Payment History</h3>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 bg-slate-50 p-3 text-xs font-semibold">
          <div>Reference</div>
          <div>Date</div>
          <div>Method</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        <div className="py-10 text-center text-slate-400 text-sm">
          No payment records found.
        </div>
      </div>
    </div>
  ) : activeTab === "Payouts" ? (
    <div>
      <h3 className="font-semibold text-sm mb-4">Payout History</h3>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-slate-50 p-3 text-xs font-semibold">
          <div>Date</div>
          <div>Bank</div>
          <div>Amount</div>
          <div>Status</div>
        </div>

        <div className="py-10 text-center text-slate-400 text-sm">
          No payout records available.
        </div>
      </div>
    </div>
  ) : (
    <div className="border border-dashed rounded-lg py-10 text-center">
      <p className="text-slate-400">No data available.</p>
    </div>
  )}
</div>
      </div>
    </div>
  )
}

// ─── main ───────────────────────────────────────────────────────────────────

// const PAGE_SIZE = 14
const TOTAL_ROWS = 40

const MainUsers = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set(rows.slice(0, 6).map((r) => r.id)))
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [users, setUsers] = useState<UserRow[]>([])
const [totalRows, setTotalRows] = useState(0)
const [pageSize, setPageSize] = useState(20)
const [totalPages, setTotalPages] = useState(1)
console.log(totalPages)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null)

  const allChecked = selected.size === users.length
  const someChecked = selected.size > 0 && !allChecked

  console.log("checked", someChecked)

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(users.map((r) => r.id)))
  }

  const token = localStorage.getItem("token")

const getAllUsers = async () => {
  try {
    const res = await axios.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data.data;

    setTotalRows(data.total);
    setPageSize(data.record_per_page);
    setTotalPages(data.number_pages);

    const mappedUsers: UserRow[] = data.users.map((user: any) => ({
      id: String(user.id),
      userId: String(user.id),
      created_at: user.created_at,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status as Status,

      // These aren't returned yet
      country: "-",
      state: "-",
      serviceArea: "-",
      accountType: "Motorist",
      requests: 0,
      avgRating: "-",
      lastLogin: "-",
    }));

    setUsers(mappedUsers);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(()=>{
    getAllUsers()
  },[])

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

const filteredRows = query
  ? users.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.email.toLowerCase().includes(query.toLowerCase())
    )
  : users;

  const rangeStart = (page - 1) * pageSize + 1
 const rangeEnd = Math.min(page * pageSize, totalRows)

  return (
    <div className="flex flex-col gap-4 mt-4 px-5">
      {/* ── header ── */}
      <div className="flex items-center justify-between gap-4 ">
        <p className="text-xs" style={{ color: "#4a5474" }}>
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
                      {row.created_at}
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
                        <RowMenu
                          status={row.status}
                          onClose={() => setOpenMenu(null)}
                          onViewUser={() => setViewingUser(row)}
                        />
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
       {rangeStart} - {rangeEnd} of {totalRows}
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

      {/* ── user detail modal ── */}
      {viewingUser && (
        <UserDetailModal user={viewingUser} onClose={() => setViewingUser(null)} />
      )}
    </div>
  )
}

export default MainUsers