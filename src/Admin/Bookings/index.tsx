import { useEffect, useMemo, useState } from "react"
import axios from "../../Config/axiosconfig"
import toast from "react-hot-toast"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react"

// ---------- Types (matches the real /admin/bookings response) ----------
interface Booking {
  id: number
  customer: string
  provider?: string
  price: string
  status: string
  scheduled_trip: boolean
  created_at: string // e.g. "2026-05-23 05:36pm"
}

interface BookingsResponse {
  status: boolean
  message: string
  data: {
    bookings: Booking[]
    number_pages: number
    record_per_page: number
    total: number
  }
}

interface DayItem {
  day: number
  label: string
  iso: string // YYYY-MM-DD
}

type DateFilterOption =
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const statusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
  "": "bg-gray-100 text-gray-500",
}

// ---------- Date/time helpers ----------

// "2026-05-23 05:36pm" -> { iso: "2026-05-23", hour24: 17, minute: 36 }
const parseBookingDateTime = (createdAt: string) => {
  const [datePart, timePart] = createdAt.split(" ")
  const match = timePart?.match(/(\d{1,2}):(\d{2})(am|pm)/i)
  let hour24 = 0
  let minute = 0
  if (match) {
    hour24 = parseInt(match[1], 10) % 12
    minute = parseInt(match[2], 10)
    if (match[3].toLowerCase() === "pm") hour24 += 12
  }
  return { iso: datePart, hour24, minute }
}

const hourLabel = (hour24: number) => {
  const period = hour24 < 12 ? "AM" : "PM"
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${h12} ${period}`
}

const hourRangeLabel = (hour24: number) => `${hourLabel(hour24)} - ${hourLabel((hour24 + 1) % 24)}`

const toIso = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const getMonthDays = (year: number, month: number): DayItem[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateObj = new Date(year, month, day)
    return { day, label: WEEKDAY_NAMES[dateObj.getDay()], iso: toIso(dateObj) }
  })
}

const monthTitle = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })

const formatFriendlyDate = (iso: string) => {
  if (!iso) return ""
  const [y, m, d] = iso.split("-").map(Number)
  const dateObj = new Date(y, m - 1, d)
  return dateObj.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
}

// Computes an inclusive { from, to } ISO range for a preset date-filter option
const computeRangeForOption = (option: DateFilterOption): { from: string; to: string } => {
  const now = new Date()
  const startOfWeek = (d: Date) => {
    const copy = new Date(d)
    const day = copy.getDay()
    copy.setDate(copy.getDate() - day)
    return copy
  }

  switch (option) {
    case "thisWeek": {
      const start = startOfWeek(now)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return { from: toIso(start), to: toIso(end) }
    }
    case "lastWeek": {
      const start = startOfWeek(now)
      start.setDate(start.getDate() - 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return { from: toIso(start), to: toIso(end) }
    }
    case "thisMonth": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { from: toIso(start), to: toIso(end) }
    }
    case "lastMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: toIso(start), to: toIso(end) }
    }
    case "thisYear": {
      const start = new Date(now.getFullYear(), 0, 1)
      const end = new Date(now.getFullYear(), 11, 31)
      return { from: toIso(start), to: toIso(end) }
    }
    case "lastYear": {
      const start = new Date(now.getFullYear() - 1, 0, 1)
      const end = new Date(now.getFullYear() - 1, 11, 31)
      return { from: toIso(start), to: toIso(end) }
    }
  }
}

const DATE_FILTER_LABELS: { value: DateFilterOption; label: string }[] = [
  { value: "thisWeek", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
]

const Bookings = () => {
  const token = localStorage.getItem("token")

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Calendar / day selection
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedIso, setSelectedIso] = useState(toIso(today))
  const [hasAutoSelected, setHasAutoSelected] = useState(false)

  // Hour selection within the day timeline (drives what shows in the right column)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  // Filter panel (mirrors the Filter / filterByDate reference)
  const [filterOpen, setFilterOpen] = useState(false)
  const [byDateOption, setByDateOption] = useState<DateFilterOption | null>(null)
  const [useDateRange, setUseDateRange] = useState(false)
  const [rangeFrom, setRangeFrom] = useState("")
  const [rangeTo, setRangeTo] = useState("")
  const [activeRange, setActiveRange] = useState<{ from: string; to: string } | null>(null)

  const getBookings = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const res = await axios.get<BookingsResponse>("/admin/bookings", {
        params: { page: pageNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { bookings: fetched, number_pages, total } = res.data.data
      setBookings(fetched)
      setTotalPages(number_pages)
      setTotal(total)
      setPage(pageNumber)
    } catch (error) {
      toast.error("Could not load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookings(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Jump the calendar to wherever the data actually lives, once, after the first load
  useEffect(() => {
    if (!hasAutoSelected && bookings.length > 0) {
      const { iso } = parseBookingDateTime(bookings[0].created_at)
      const [y, m] = iso.split("-").map(Number)
      setViewYear(y)
      setViewMonth(m - 1)
      setSelectedIso(iso)
      setHasAutoSelected(true)
    }
  }, [bookings, hasAutoSelected])

  const monthDays = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth])

  const goToPrevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1)
    setViewYear(prev.getFullYear())
    setViewMonth(prev.getMonth())
  }
  const goToNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  // Search + active date-range filter, applied together
  const poolBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (search && !b.customer.toLowerCase().includes(search.toLowerCase())) return false
      if (activeRange) {
        const { iso } = parseBookingDateTime(b.created_at)
        if (iso < activeRange.from || iso > activeRange.to) return false
      }
      return true
    })
  }, [bookings, search, activeRange])

  // Which days in the visible month actually have bookings (for the dot indicator)
  const daysWithBookings = useMemo(() => {
    const set = new Set<string>()
    poolBookings.forEach((b) => set.add(parseBookingDateTime(b.created_at).iso))
    return set
  }, [poolBookings])

  // Bookings for the selected day, grouped by hour
  const dayBookings = useMemo(
    () => poolBookings.filter((b) => parseBookingDateTime(b.created_at).iso === selectedIso),
    [poolBookings, selectedIso]
  )

  const hourGroups = useMemo(() => {
    const map = new Map<number, Booking[]>()
    dayBookings.forEach((b) => {
      const { hour24 } = parseBookingDateTime(b.created_at)
      if (!map.has(hour24)) map.set(hour24, [])
      map.get(hour24)!.push(b)
    })
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [dayBookings])

  // Reset hour selection whenever the day changes, default to the first hour that has bookings
  useEffect(() => {
    setSelectedHour(hourGroups.length > 0 ? hourGroups[0][0] : null)
  }, [selectedIso]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cards shown in the right-hand column: the selected hour's bookings,
  // or every booking for the day if no hour is picked
  const rightColumnBookings = useMemo(() => {
    if (selectedHour === null) return dayBookings
    return hourGroups.find(([h]) => h === selectedHour)?.[1] ?? []
  }, [selectedHour, hourGroups, dayBookings])

  const applyFilter = () => {
    if (useDateRange && rangeFrom && rangeTo) {
      setActiveRange({ from: rangeFrom, to: rangeTo })
    } else if (byDateOption) {
      setActiveRange(computeRangeForOption(byDateOption))
    } else {
      setActiveRange(null)
    }
    setFilterOpen(false)
  }

  const clearFilter = () => {
    setByDateOption(null)
    setUseDateRange(false)
    setRangeFrom("")
    setRangeTo("")
    setActiveRange(null)
    setFilterOpen(false)
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Schedules</h1>

      {/* Top bar: date, nav arrows, search, filters */}
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-gray-700" />
        <span className="text-lg font-semibold text-gray-900">{formatFriendlyDate(selectedIso)}</span>
        <button
          onClick={goToPrevMonth}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={goToNextMonth}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 ml-4 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Vehicle, customer, location and others"
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Filters trigger + dropdown panel */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 ${
              activeRange ? "border-blue-300 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-700"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-11 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-72 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Filter</p>
              <p className="text-xs font-medium text-gray-500 mb-2">By Date</p>

              <div className="grid grid-cols-2 gap-y-2 mb-3">
                {DATE_FILTER_LABELS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={byDateOption === opt.value}
                      onChange={() =>
                        setByDateOption((current) => (current === opt.value ? null : opt.value))
                      }
                      className="rounded border-gray-300"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={useDateRange}
                  onChange={(e) => setUseDateRange(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Date Range
              </label>

              {useDateRange && (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="date"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5"
                  />
                  <input
                    type="date"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                    className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={clearFilter}
                  className="flex-1 text-xs text-gray-600 border border-gray-200 rounded-lg py-2 hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={applyFilter}
                  className="flex-1 text-xs font-medium text-white bg-blue-600 rounded-lg py-2 hover:bg-blue-700"
                >
                  Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left: calendar / hour timeline */}
        <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden">
          {/* Month label */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{monthTitle(viewYear, viewMonth)}</span>
            {activeRange && (
              <span className="text-[10px] text-blue-600">
                Filtered: {formatFriendlyDate(activeRange.from)} – {formatFriendlyDate(activeRange.to)}
              </span>
            )}
          </div>

          {/* Date strip */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {monthDays.map((d) => {
              const isSelected = d.iso === selectedIso
              const hasBookings = daysWithBookings.has(d.iso)
              return (
                <button
                  key={d.iso}
                  onClick={() => setSelectedIso(d.iso)}
                  className={`relative flex flex-col items-center justify-center py-2 px-3 text-xs shrink-0 border-r border-gray-100 last:border-r-0 ${
                    isSelected ? "bg-blue-600 text-white rounded-md m-1" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{d.day}</span>
                  <span className={isSelected ? "text-blue-100" : "text-gray-400"}>{d.label}</span>
                  {hasBookings && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Hour ruler */}
          <div className="flex overflow-x-auto bg-gray-50 text-[11px] text-gray-500">
            {Array.from({ length: 24 }, (_, hour24) => (
              <div
                key={hour24}
                className={`py-1.5 px-3 text-center border-r border-gray-100 shrink-0 w-24 ${
                  hour24 === selectedHour ? "text-blue-600 font-medium underline" : ""
                }`}
              >
                {hourLabel(hour24)}
              </div>
            ))}
          </div>

          {/* Hour timeline: aggregated "N Rides Scheduled" cards, grouped by hour */}
          <div className="flex overflow-x-auto py-3 px-2 gap-2 min-h-28">
            {loading && <p className="text-xs text-gray-400 py-6 px-2">Loading bookings…</p>}

            {!loading && hourGroups.length === 0 && (
              <p className="text-xs text-gray-400 py-6 px-2">No bookings scheduled for this day.</p>
            )}

            {!loading &&
              hourGroups.map(([hour24, hourBookings]) => {
                const isSelected = selectedHour === hour24
                return (
                  <button
                    key={hour24}
                    onClick={() => setSelectedHour(isSelected ? null : hour24)}
                    className={`w-40 shrink-0 text-left border rounded-md p-2 text-[11px] shadow-sm transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-100"
                        : "border-blue-300 bg-blue-50 hover:bg-blue-100"
                    }`}
                  >
                    <p className="font-semibold text-gray-800">Schedules</p>
                    <p className="text-gray-500">{hourRangeLabel(hour24)}</p>
                    <p className="text-gray-700 font-medium mt-1">
                      {hourBookings.length} {hourBookings.length === 1 ? "Ride" : "Rides"} Scheduled
                    </p>
                  </button>
                )
              })}
          </div>
        </div>

        {/* Right: booking cards, stacked in a column */}
        <div className="w-80 flex flex-col gap-3">
          {selectedHour !== null && (
            <p className="text-xs font-medium text-gray-500">
              Bookings between {hourRangeLabel(selectedHour)}
            </p>
          )}

          {loading && <p className="text-xs text-gray-400 text-center py-6">Loading bookings…</p>}

          {!loading && rightColumnBookings.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No bookings found.</p>
          )}

          {rightColumnBookings.map((b) => (
            <div key={b.id} className="relative border border-gray-100 rounded-xl shadow-sm overflow-visible">
              <div className="flex items-center justify-between px-3 pt-3">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded-md">
                    {b.created_at.split(" ")[1]}
                  </span>
                  <span className="text-[10px] text-gray-400">{b.created_at.split(" ")[0]}</span>
                </div>
                <button
                  onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)}
                  className="p-1 rounded hover:bg-gray-50"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {openMenuId === b.id && (
                <div className="absolute right-3 top-9 z-10 bg-white border border-gray-100 rounded-lg shadow-md text-xs text-gray-700 py-1 w-44">
                  <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Message Customer</button>
                  <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Message Service Provider</button>
                </div>
              )}

              <div className="px-3 py-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                  <div className="text-xs">
                    <p className="text-gray-400 leading-none mb-0.5">Customer</p>
                    <p className="font-medium text-gray-800">{b.customer}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <div className="text-xs">
                    <p className="text-gray-400 leading-none mb-0.5">Provider</p>
                    <p className="font-medium text-gray-800">{b.provider || "Not assigned"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-gray-800">{b.price}</span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      statusStyles[b.status] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {b.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
              <span>
                Page {page} of {totalPages} · {total} total
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => page > 1 && getBookings(page - 1)}
                  disabled={page <= 1}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => page < totalPages && getBookings(page + 1)}
                  disabled={page >= totalPages}
                  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings