import { useState } from "react"
import { Search, Maximize2 } from "lucide-react"

type CityBreakdown = { city: string; amount: string }

export type MapRegion = {
  id: string
  name: string
  color: string
  path: string
  totalSales: string
  cityBreakdown: CityBreakdown[]
  popularService: string
  avgFare: string
}

const regions: MapRegion[] = [
  {
    id: "us",
    name: "United States",
    color: "#f5a623",
    path: "M35 55 C30 45 45 35 65 32 C90 28 115 35 125 48 C132 56 128 66 118 70 C122 78 116 88 104 88 C96 96 80 94 70 86 C58 90 44 84 40 72 C30 70 28 62 35 55 Z",
    totalSales: "$45,000",
    cityBreakdown: [
      { city: "Atlanta", amount: "$25,000" },
      { city: "Georgia", amount: "$10,000" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$36",
  },
  {
    id: "br",
    name: "Brazil",
    color: "#e5484d",
    path: "M100 130 C96 122 104 112 116 110 C130 108 142 116 146 130 C150 146 146 164 138 176 C132 186 120 190 112 182 C102 178 98 164 98 150 C96 142 96 136 100 130 Z",
    totalSales: "$32,400",
    cityBreakdown: [
      { city: "São Paulo", amount: "$19,000" },
      { city: "Rio de Janeiro", amount: "$8,200" },
    ],
    popularService: "City Rides",
    avgFare: "$21",
  },
  {
    id: "ng",
    name: "Nigeria",
    color: "#14b8a6",
    path: "M200 118 C198 112 206 107 214 108 C222 109 226 116 224 123 C222 130 214 133 207 130 C201 128 200 123 200 118 Z",
    totalSales: "$18,900",
    cityBreakdown: [
      { city: "Lagos", amount: "$14,500" },
      { city: "Abuja", amount: "$4,400" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$14",
  },
  {
    id: "za",
    name: "South Africa",
    color: "#3b82f6",
    path: "M204 155 C200 148 208 140 218 140 C228 140 234 148 232 158 C230 168 220 174 212 170 C206 168 204 162 204 155 Z",
    totalSales: "$21,300",
    cityBreakdown: [
      { city: "Cape Town", amount: "$12,000" },
      { city: "Johannesburg", amount: "$9,300" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$19",
  },
  {
    id: "in",
    name: "India",
    color: "#a855f7",
    path: "M258 90 C254 80 264 70 278 70 C290 70 298 80 296 92 C300 102 296 116 286 122 C278 128 268 124 264 114 C258 108 256 98 258 90 Z",
    totalSales: "$51,200",
    cityBreakdown: [
      { city: "Mumbai", amount: "$28,000" },
      { city: "Delhi", amount: "$16,500" },
    ],
    popularService: "City Rides",
    avgFare: "$9",
  },
  {
    id: "au",
    name: "Australia",
    color: "#22c55e",
    path: "M300 165 C296 158 306 150 320 150 C334 150 344 158 342 168 C340 178 328 184 316 182 C306 180 302 172 300 165 Z",
    totalSales: "$14,700",
    cityBreakdown: [
      { city: "Sydney", amount: "$9,000" },
      { city: "Melbourne", amount: "$5,700" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$32",
  },
]

// faint unlabeled landmasses purely for visual context (Europe / rest of Asia)
const backdropPaths = [
  "M195 55 C192 48 200 40 212 40 C224 40 230 48 226 58 C222 68 210 72 200 66 C196 63 194 59 195 55 Z",
  "M235 55 C232 45 250 34 275 34 C305 32 330 42 335 58 C340 74 325 88 300 88 C280 92 260 86 248 74 C238 68 234 62 235 55 Z",
]

export default function SalesMap() {
  const [hovered, setHovered] = useState<MapRegion | null>(null)
  const [query, setQuery] = useState("")

  const filtered = query
    ? regions.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : regions

  return (
    <div className="rounded-xl p-5 bg-white shadow-sm border h-full flex flex-col" style={{ borderColor: "#eaecf3" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>
          Sales Mapping by Country
        </p>
        <Maximize2 size={16} color="#8b94b2" className="cursor-pointer" />
      </div>

      <div
        className="flex items-center gap-2 rounded-md border px-3 py-2 mb-4"
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

      <div className="relative flex-1">
        <svg viewBox="0 0 400 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {backdropPaths.map((d, i) => (
            <path key={i} d={d} fill="#eef1f6" />
          ))}
          {regions.map((r) => {
            const isMatch = filtered.some((f) => f.id === r.id)
            return (
              <path
                key={r.id}
                d={r.path}
                fill={r.color}
                opacity={query ? (isMatch ? 1 : 0.18) : 1}
                stroke={hovered?.id === r.id ? "#14161f" : "transparent"}
                strokeWidth={1.5}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>

        {hovered && (
          <div
            className="absolute z-20 w-56 rounded-lg bg-[#14161f] text-white p-3 text-[11px] leading-relaxed shadow-xl pointer-events-none"
            style={{ left: "10%", top: "8%" }}
          >
            <p className="font-semibold text-[12px] mb-1.5">{hovered.name}</p>
            <p>Total Sales: {hovered.totalSales}</p>
            <p className="mt-1.5 font-semibold">City Breakdown:</p>
            {hovered.cityBreakdown.map((c) => (
              <p key={c.city}>
                {c.city}: {c.amount}
              </p>
            ))}
            <p className="mt-1.5">Most Popular Service: {hovered.popularService}</p>
            <p>Average Fare per Ride: {hovered.avgFare}</p>
          </div>
        )}
      </div>
    </div>
  )
}