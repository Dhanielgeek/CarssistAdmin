import { Search, SlidersHorizontal, Download } from 'lucide-react';

interface ToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onExport: () => void;
}

export default function Toolbar({ query, onQueryChange, onExport }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-base font-semibold text-slate-800">Carssist Riders</h1>
        <p className="text-sm text-slate-400">All Carssist Riders who provide assistance</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search"
            className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}