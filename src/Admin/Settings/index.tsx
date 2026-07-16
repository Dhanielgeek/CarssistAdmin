import { useState } from "react";
import { Check, X, ChevronLeft, ChevronRight, Search } from "lucide-react";

type AccessLevel = "none" | "view" | "full";

interface RoleRow {
  feature: string;
  superAdmin: AccessLevel;
  admin: AccessLevel;
  support: AccessLevel;
  juniorSupport: AccessLevel;
  editable?: boolean; // row supports cycling access level via arrows
}

interface LogRow {
  timestamp: string;
  logId: string;
  name: string;
  id: string;
  role: string;
  target: string;
  description: string;
  ip: string;
  device: string;
}

const ACCESS_LEVELS: AccessLevel[] = ["none", "view", "full"];

const ACCESS_LABEL: Record<AccessLevel, string> = {
  none: "No Access",
  view: "View Only",
  full: "Full Access",
};

const initialRoles: RoleRow[] = [
  { feature: "User Management", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none" },
  { feature: "Track", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none" },
  { feature: "Payment Management", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none" },
  { feature: "Payouts Management", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none" },
  { feature: "Roles & Permissions", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none" },
  { feature: "Audit & Activity Logs", superAdmin: "full", admin: "full", support: "full", juniorSupport: "none", editable: true },
];

const logRows: LogRow[] = Array.from({ length: 12 }).map((_, i) => {
  const roles = ["Super Admin", "Support", "Junior Support", "Support", "Junior Support", "Junior Support", "Support", "Super Admin", "Junior Support", "Super Admin", "Support", "Junior Support"];
  const targets = ["Admin Portal", "Payout: #891", "User: #2032", "Booking: #4455", "Payout: #891", "Booking: #4455", "Admin Portal", "Payout: #891", "User: #2032", "Admin Portal", "User: #2032", "User: #2032"];
  const devices = ["Chrome on Windows 11", "Chrome on Windows 11", "Chrome on Windows 11", "Safari on macOS", "Safari on macOS", "Chrome on Windows 11", "Safari on macOS", "Chrome on Windows 11", "Chrome on Windows 11", "Chrome on Windows 11", "Chrome on Windows 11", "Chrome on Windows 11"];
  const role = roles[i % roles.length];
  return {
    timestamp: "Tue, Mar 13, AT 09:00AM",
    logId: "123422345",
    name: "Alex Alexander",
    id: "123422345",
    role,
    target: targets[i % targets.length],
    description: role === "Super Admin" && targets[i % targets.length] === "Admin Portal" ? "Logged into the admin dashboard" : "Activity done",
    ip: "102.89.15.213",
    device: devices[i % devices.length],
  };
});

function AccessCell({
  level,
  editable,
  onChange,
}: {
  level: AccessLevel;
  editable?: boolean;
  onChange?: (level: AccessLevel) => void;
}) {
  const cycle = (dir: 1 | -1) => {
    if (!onChange) return;
    const idx = ACCESS_LEVELS.indexOf(level);
    const next = ACCESS_LEVELS[(idx + dir + ACCESS_LEVELS.length) % ACCESS_LEVELS.length];
    onChange(next);
  };

  if (level === "none" && !editable) {
    return <X className="w-4 h-4 text-red-500" strokeWidth={3} />;
  }

  if (!editable) {
    return (
      <span className="flex items-center gap-2 font-semibold text-slate-800">
        {ACCESS_LABEL[level]}
        <span className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="flex items-center gap-2 font-semibold text-slate-800">
        <button
          type="button"
          onClick={() => cycle(-1)}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Previous access level"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {ACCESS_LABEL[level]}
        <span
          className={`w-4 h-4 rounded flex items-center justify-center ${
            level === "none" ? "bg-slate-200" : "bg-blue-600"
          }`}
        >
          {level !== "none" && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
        <button
          type="button"
          onClick={() => cycle(1)}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Next access level"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </span>
      <span className="h-px bg-blue-500 w-full" />
    </span>
  );
}

function RolesTable({
  roles,
  onChangeCell,
}: {
  roles: RoleRow[];
  onChangeCell: (rowIndex: number, column: "superAdmin", level: AccessLevel) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="py-3 px-5 font-semibold">Feature / Module</th>
            <th className="py-3 px-5 font-semibold">Super Admin</th>
            <th className="py-3 px-5 font-semibold">Admin</th>
            <th className="py-3 px-5 font-semibold">Support</th>
            <th className="py-3 px-5 font-semibold">Junior Support</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {roles.map((row, i) => (
            <tr key={row.feature} className="border-t border-slate-100">
              <td className="py-4 px-5 font-semibold text-slate-800">{row.feature}</td>
              <td className="py-4 px-5">
                <AccessCell
                  level={row.superAdmin}
                  editable={row.editable}
                  onChange={row.editable ? (lvl) => onChangeCell(i, "superAdmin", lvl) : undefined}
                />
              </td>
              <td className="py-4 px-5">
                <AccessCell level={row.admin} />
              </td>
              <td className="py-4 px-5">
                <AccessCell level={row.support} />
              </td>
              <td className="py-4 px-5">
                <AccessCell level={row.juniorSupport} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LogsTable() {
  const columns: { key: keyof LogRow; label: string }[] = [
    { key: "timestamp", label: "Time Stamp" },
    { key: "logId", label: "Log ID" },
    { key: "name", label: "Name" },
    { key: "id", label: "ID" },
    { key: "role", label: "Role" },
    { key: "target", label: "Target" },
    { key: "description", label: "Description" },
    { key: "ip", label: "IP Address" },
    { key: "device", label: "Device / Browser" },
  ];
  const [page, setPage] = useState(12);
  const totalPages = 20;
  const pageNumbers = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search logs"
          className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 font-semibold">
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {logRows.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-3 px-4 text-slate-600">{row.timestamp}</td>
                <td className="py-3 px-4 text-slate-600">{row.logId}</td>
                <td className="py-3 px-4 text-slate-800 font-medium">{row.name}</td>
                <td className="py-3 px-4 text-slate-600">{row.id}</td>
                <td className="py-3 px-4 text-slate-600">{row.role}</td>
                <td className="py-3 px-4 text-slate-600">{row.target}</td>
                <td className="py-3 px-4 text-slate-600">{row.description}</td>
                <td className="py-3 px-4 text-slate-600">{row.ip}</td>
                <td className="py-3 px-4 text-slate-600">{row.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <button
          className="flex items-center gap-1 font-semibold text-slate-800 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 15))}
        >
          <ChevronLeft className="w-4 h-4" /> Prev 15
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(1)} className="hover:text-blue-600">
            1
          </button>
          <span>...</span>
          {pageNumbers.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                n === page ? "bg-blue-600 text-white font-semibold" : "hover:text-blue-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1 font-semibold text-slate-800 disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages, p + 15))}
        >
          Next 15 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AddAccountModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (roles: RoleRow[]) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<RoleRow[]>(
    initialRoles.map((r) => ({ ...r, superAdmin: "full" }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white mb-1"
          >
            <ChevronLeft className="w-3 h-3" /> Add new
          </button>
          <h2 className="text-lg font-semibold">Add Account type</h2>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maureen"
              className="w-full border-b border-slate-200 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@email.com"
              className="w-full border-b border-slate-200 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+2347082427348"
              className="w-full border-b border-slate-200 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full border-b border-slate-200 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="py-2.5 px-4 font-semibold">Feature / Module</th>
                  <th className="py-2.5 px-4 font-semibold">New user access</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {roles.map((row, i) => (
                  <tr key={row.feature} className="border-t border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-800">{row.feature}</td>
                    <td className="py-3 px-4">
                      <AccessCell
                        level={row.superAdmin}
                        editable={row.editable}
                        onChange={
                          row.editable ? (lvl) => setRoles((prev) => prev.map((r, idx) => (idx === i ? { ...r, superAdmin: lvl } : r))) : undefined
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => onAdd(roles)}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2.5 rounded-full mt-2"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

const Settings = () => {
  const [tab, setTab] = useState<"roles" | "logs">("roles");
  const [roles, setRoles] = useState<RoleRow[]>(initialRoles);
  const [modalOpen, setModalOpen] = useState(false);

  const updateCell = (rowIndex: number, column: "superAdmin", level: AccessLevel) => {
    setRoles((prev) => prev.map((r, i) => (i === rowIndex ? { ...r, [column]: level } : r)));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full rounded-full bg-slate-100 p-1 sm:w-auto">
            <button
              onClick={() => setTab("roles")}
              className={`min-h-10 flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex-none ${
                tab === "roles" ? "bg-slate-900 text-white" : "text-slate-500"
              }`}
            >
              Roles and permissions
            </button>
            <button
              onClick={() => setTab("logs")}
              className={`min-h-10 flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex-none ${
                tab === "logs" ? "bg-slate-900 text-white" : "text-slate-500"
              }`}
            >
              Log
            </button>
          </div>

          {tab === "roles" && (
            <button
              onClick={() => setModalOpen(true)}
              className="min-h-10 px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add new
            </button>
          )}
        </div>

        {tab === "roles" ? (
          <RolesTable roles={roles} onChangeCell={updateCell} />
        ) : (
          <LogsTable />
        )}
      </div>

      {modalOpen && (
        <AddAccountModal
          onClose={() => setModalOpen(false)}
          onAdd={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Settings;
