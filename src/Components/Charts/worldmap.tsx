import { useState, useEffect, useMemo } from "react"
import { Search, Maximize2 } from "lucide-react"
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"

type CityBreakdown = { city: string; amount: string }

export type MapRegion = {
  id: string // ISO A3 code
  name: string
  totalSales: string
  cityBreakdown: CityBreakdown[]
  popularService: string
  avgFare: string
}

// Sales tiers -> color + label. Amount thresholds are parsed from totalSales.
const TIERS = [
  { key: "low", label: "Low sales", max: 20000, color: "#ef4444" }, // red
  { key: "medium", label: "Medium sales", max: 35000, color: "#f5c518" }, // yellow
  { key: "high", label: "High sales", max: Infinity, color: "#3b82f6" }, // blue
] as const

function parseAmount(value: string): number {
  const n = Number(value.replace(/[^0-9.-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function getTier(amount: number) {
  return TIERS.find((t) => amount <= t.max) ?? TIERS[TIERS.length - 1]
}

const regions: MapRegion[] = [
  {
    id: "USA",
    name: "United States",
    totalSales: "$45,000",
    cityBreakdown: [
      { city: "Atlanta", amount: "$25,000" },
      { city: "Georgia", amount: "$10,000" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$36",
  },
  {
    id: "BRA",
    name: "Brazil",
    totalSales: "$32,400",
    cityBreakdown: [
      { city: "São Paulo", amount: "$19,000" },
      { city: "Rio de Janeiro", amount: "$8,200" },
    ],
    popularService: "City Rides",
    avgFare: "$21",
  },
  {
    id: "NGA",
    name: "Nigeria",
    totalSales: "$18,900",
    cityBreakdown: [
      { city: "Lagos", amount: "$14,500" },
      { city: "Abuja", amount: "$4,400" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$14",
  },
  {
    id: "ZAF",
    name: "South Africa",
    totalSales: "$21,300",
    cityBreakdown: [
      { city: "Cape Town", amount: "$12,000" },
      { city: "Johannesburg", amount: "$9,300" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$19",
  },
  {
    id: "IND",
    name: "India",
    totalSales: "$51,200",
    cityBreakdown: [
      { city: "Mumbai", amount: "$28,000" },
      { city: "Delhi", amount: "$16,500" },
    ],
    popularService: "City Rides",
    avgFare: "$9",
  },
  {
    id: "AUS",
    name: "Australia",
    totalSales: "$14,700",
    cityBreakdown: [
      { city: "Sydney", amount: "$9,000" },
      { city: "Melbourne", amount: "$5,700" },
    ],
    popularService: "Airport Transfers",
    avgFare: "$32",
  },
]

const regionMap = new Map(regions.map((r) => [r.id, r]))

// Precompute sales amount + tier + marker radius (sqrt scale) per region
const salesValues = regions.map((r) => parseAmount(r.totalSales))
const maxSales = Math.max(...salesValues)
const minSales = Math.min(...salesValues)

function radiusFor(amount: number) {
  if (maxSales === minSales) return 10
  const t = (Math.sqrt(amount) - Math.sqrt(minSales)) / (Math.sqrt(maxSales) - Math.sqrt(minSales))
  return 6 + t * 10 // 6px - 16px
}

export default function SalesMap() {
  const [hovered, setHovered] = useState<MapRegion | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [query, setQuery] = useState("")
  const [worldFeatures, setWorldFeatures] = useState<any[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topo) => {
        if (cancelled) return
        const geojson: any = feature(topo, topo.objects.countries)
        setWorldFeatures(geojson.features)
      })
      .catch((err) => console.error("Failed to load world map data:", err))
    return () => {
      cancelled = true
    }
  }, [])

  const projection = useMemo(
    () => geoMercator().scale(120).translate([400, 260]),
    []
  )
  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  const filtered = query
    ? regions.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : regions
  const filteredIds = new Set(filtered.map((r) => r.id))

  // Centroids for placing sales indicator markers, computed once world data loads
  const centroids = useMemo(() => {
    if (!worldFeatures) return new Map<string, [number, number]>()
    const map = new Map<string, [number, number]>()
    worldFeatures.forEach((f: any) => {
      const iso3 = f.properties?.ISO_A3 || f.properties?.iso_a3 || f.id
      if (regionMap.has(iso3)) {
        const c = pathGenerator.centroid(f)
        if (c && !Number.isNaN(c[0]) && !Number.isNaN(c[1])) {
          map.set(iso3, c as [number, number])
        }
      }
    })
    return map
  }, [worldFeatures, pathGenerator])

  return (
    <div
      className="rounded-xl p-5 bg-white shadow-sm border h-full flex flex-col"
      style={{ borderColor: "#eaecf3" }}
    >
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

      <div
        className="relative flex-1"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
      >
        {!worldFeatures ? (
          <div
            className="flex items-center justify-center h-full text-xs"
            style={{ color: "#8b94b2" }}
          >
            Loading map...
          </div>
        ) : (
          <svg viewBox="0 0 800 520" className="w-full h-full">
            {worldFeatures.map((f: any) => {
              const iso3 = f.properties?.ISO_A3 || f.properties?.iso_a3 || f.id
              const match = regionMap.get(iso3)
              const isDimmed = query && ((match && !filteredIds.has(match.id)) || !match)

              return (
                <path
                  key={f.id ?? f.properties?.name ?? Math.random()}
                  d={pathGenerator(f) || undefined}
                  fill={match ? "#eef1f6" : "#f6f7fb"}
                  stroke={hovered?.id === match?.id ? "#14161f" : "#ffffff"}
                  strokeWidth={hovered?.id === match?.id ? 1.5 : 0.5}
                  opacity={isDimmed ? 0.18 : 1}
                  className="transition-opacity"
                  style={{ cursor: match ? "pointer" : "default" }}
                  onMouseEnter={() => match && setHovered(match)}
                  onMouseLeave={() => setHovered(null)}
                />
              )
            })}

            {/* Sales indicator markers: colored by tier (red/yellow/blue), sized by sales volume */}
            {regions.map((r) => {
              const centroid = centroids.get(r.id)
              if (!centroid) return null
              const amount = parseAmount(r.totalSales)
              const tier = getTier(amount)
              const radius = radiusFor(amount)
              const isDimmed = query && !filteredIds.has(r.id)
              const isHovered = hovered?.id === r.id

              return (
                <g
                  key={r.id}
                  opacity={isDimmed ? 0.15 : 1}
                  className="transition-opacity"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(r)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* pulsing ring to signal active sales */}
                  <circle
                    cx={centroid[0]}
                    cy={centroid[1]}
                    r={radius}
                    fill={tier.color}
                    opacity={0.35}
                    className="animate-ping"
                    style={{ transformOrigin: `${centroid[0]}px ${centroid[1]}px` }}
                  />
                  <circle
                    cx={centroid[0]}
                    cy={centroid[1]}
                    r={radius}
                    fill={tier.color}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1.5}
                  />
                </g>
              )
            })}
          </svg>
        )}

        {hovered && hoverPos && (
          <div
            className="absolute z-20 w-56 rounded-lg bg-[#14161f] text-white p-3 text-[11px] leading-relaxed shadow-xl pointer-events-none"
            style={{ left: hoverPos.x + 12, top: hoverPos.y + 12 }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: getTier(parseAmount(hovered.totalSales)).color }}
              />
              <p className="font-semibold text-[12px]">{hovered.name}</p>
            </div>
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

        {/* Legend: what red / yellow / blue mean */}
        <div
          className="absolute bottom-2 left-2 flex items-center gap-3 rounded-md bg-white/90 border px-3 py-1.5 text-[10px]"
          style={{ borderColor: "#e2e6ee", color: "#2d3452" }}
        >
          {TIERS.map((t) => (
            <div key={t.key} className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: t.color }}
              />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}