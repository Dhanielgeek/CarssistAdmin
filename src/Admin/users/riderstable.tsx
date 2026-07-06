import { ChevronDown, MoreVertical, Search, Download, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import type { Rider, SortState } from '../../types/rider';
import StatusBadge from '../../Components/statusbadge';

interface Column {
  key: keyof Rider;
  label: string;
}

const COLUMNS: Column[] = [
  { key: 'regDate', label: 'Reg Date' },
  { key: 'userId', label: 'User ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNo', label: 'Phone No' },
  { key: 'country', label: 'Country' },
  { key: 'state', label: 'State' },
  { key: 'assists', label: 'Assists' },
  { key: 'averageRating', label: 'Average Rating' },
  { key: 'serviceArea', label: 'Service Area' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'acStatus', label: 'AC Status' },
];

interface RidersTableProps {
  riders: Rider[];
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  sort: SortState;
  onSort: (column: keyof Rider) => void;


  title?: string;
  description?: string;
  ridesMode?: boolean;
}

export default function RidersTable({
  riders,
  selectedIds,
  onToggleRow,
  onToggleAll,
  sort,
  onSort,
}: RidersTableProps) {
  const allSelected =
    riders.length > 0 && riders.every((r) => selectedIds.has(r.id));


    console.log('RidersTable rendered with riders:', riders);
    console.log(riders.length);

    const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;


const filteredRiders = useMemo(() => {
  return riders.filter((rider) => {
    const matchesSearch =
      rider.name.toLowerCase().includes(search.toLowerCase()) ||
      rider.email.toLowerCase().includes(search.toLowerCase()) ||
      rider.userId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || rider.acStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [riders, search, statusFilter]);



const totalPages = Math.ceil(filteredRiders.length / rowsPerPage);

const paginatedRiders = filteredRiders.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);



  return (
    <div className=" px-5">

<div className="mb-3 flex items-center h-18.5 justify-between">
  {/* Left */}
  <p className="text-sm text-slate-500">
    All Carssist Riders who provide assistance.
  </p>

  {/* Right */}
  <div className="flex items-center gap-3">
    {/* Search */}
    <div className="relative w-80">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search riders..."
        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 outline-none focus:border-blue-500"
      />
    </div>

    {/* Filter */}
    <div className="relative">
      <Filter
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
        className="rounded-lg border border-slate-200 py-2 pl-9 pr-8"
      >
        <option>Filters</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>Pending</option>
      </select>
    </div>

    {/* Export */}
    <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-black hover:bg-blue-100">
      <Download size={18} />
      Export
    </button>
  </div>
</div>


<div className=" overflow-x-auto rounded-lg border border-slate-200 bg-white">
     <table className="w-full min-w-300 border-collapse text-left">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="h-4 w-4 cursor-pointer accent-white"
              />
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-sm font-medium"
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      sort.column === col.key && sort.direction === 'asc' ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </th>
            ))}
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {paginatedRiders.map((rider, idx) => {
            const isSelected = selectedIds.has(rider.id);
            return (
              <tr
                key={rider.id}
                className={`border-b border-slate-100 text-sm ${
                  isSelected ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                } hover:bg-blue-50/60`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleRow(rider.id)}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.regDate}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.userId}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{rider.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.phoneNo}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.country}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.state}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.assists}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.averageRating}%</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.serviceArea}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{rider.lastLogin}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={rider.acStatus} />
                </td>
                <td className="px-4 py-3 text-slate-400">
                  <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="Row actions">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
          {filteredRiders.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 2} className="px-4 py-10 text-center text-sm text-slate-400">
                No riders match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
</div>
     

  <div className="mt-6 flex items-center justify-between">
  <p className="text-sm text-slate-500">
    Showing{" "}
    {filteredRiders.length === 0
      ? 0
      : (currentPage - 1) * rowsPerPage + 1}{" "}
    -{" "}
    {Math.min(currentPage * rowsPerPage, filteredRiders.length)} of{" "}
    {filteredRiders.length} riders
  </p>

  <div className="flex items-center gap-4">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    <span className="text-sm font-medium text-slate-600">
      Page {currentPage} of {totalPages || 1}
    </span>

    <button
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  </div>
</div>
    </div>
  );
}