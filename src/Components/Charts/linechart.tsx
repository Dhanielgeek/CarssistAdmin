import { useRef, useState, type MouseEvent, type ReactNode } from "react"

type DualLineChartPoint = {
  label: string
  a: number
  b: number
}

type DualLineChartProps = {
  data: DualLineChartPoint[]
  colorA?: string
  colorB?: string
  areaUnderA?: boolean
  tooltip?: (point: DualLineChartPoint, index: number) => ReactNode
  xLabels?: string[]
}

// Builds a smooth curved path through a list of {x,y} points
const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const midX = (p0.x + p1.x) / 2
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

const VIEW_W = 400
const VIEW_H = 170
const PAD_Y = 14

/**
 * DualLineChart
 *
 * data:        [{ label, a, b }]           - a/b are the two series values (0-100 scale works best)
 * colorA/colorB: line colors
 * areaUnderA:  fill a soft gradient under series A (default true, matches screenshot)
 * tooltip:     (point, index) => ReactNode  - content rendered inside the dark bubble on hover
 * xLabels:     override labels shown under the chart (defaults to data[i].label)
 */
export default function DualLineChart({
  data,
  colorA = "#3b82f6",
  colorB = "#22c55e",
  areaUnderA = true,
  tooltip,
  xLabels,
}: DualLineChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const max = Math.max(...data.flatMap((d) => [d.a, d.b]), 1)
  const min = Math.min(...data.flatMap((d) => [d.a, d.b]), 0)
  const range = max - min || 1

  const stepX = VIEW_W / (data.length - 1)
  const yFor = (v: number) =>
    VIEW_H - PAD_Y - ((v - min) / range) * (VIEW_H - PAD_Y * 2)

  const pointsA = data.map((d, i) => ({ x: i * stepX, y: yFor(d.a) }))
  const pointsB = data.map((d, i) => ({ x: i * stepX, y: yFor(d.b) }))

  const pathA = smoothPath(pointsA)
  const pathB = smoothPath(pointsB)
  const areaPath = `${pathA} L ${pointsA[pointsA.length - 1].x} ${VIEW_H} L ${pointsA[0].x} ${VIEW_H} Z`

  const gradientId = `lc-grad-${colorA.replace("#", "")}`

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VIEW_W
    let idx = Math.round(relX / stepX)
    idx = Math.max(0, Math.min(data.length - 1, idx))
    setHoverIndex(idx)
  }

  const hover = hoverIndex !== null ? data[hoverIndex] : null
  const hoverX = hoverIndex !== null ? pointsA[hoverIndex].x : 0
  const hoverYA = hoverIndex !== null ? pointsA[hoverIndex].y : 0
  const hoverYB = hoverIndex !== null ? pointsB[hoverIndex].y : 0

  // keep the tooltip bubble from running off either edge
  const leftPct = (hoverX / VIEW_W) * 100
  const clampedLeftPct = Math.min(86, Math.max(14, leftPct))
  const topPct = (Math.min(hoverYA, hoverYB) / VIEW_H) * 100

  return (
    <div className="relative w-full select-none">
      {hover && (
        <div
          className="absolute z-10 rounded-lg bg-[#14161f] px-3 py-2 text-white text-[11px] leading-tight pointer-events-none shadow-lg"
          style={{
            left: `${clampedLeftPct}%`,
            top: `${Math.max(topPct - 22, 0)}%`,
            transform: "translate(-50%, -100%)",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip ? tooltip(hover, hoverIndex!) : hover.label}
          <div
            className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#14161f] rotate-45"
            style={{ transform: "translateX(-50%) rotate(45deg)" }}
          />
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-42.5 overflow-visible"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorA} stopOpacity="0.22" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </linearGradient>
        </defs>

        {areaUnderA && <path d={areaPath} fill={`url(#${gradientId})`} />}

        <path d={pathA} fill="none" stroke={colorA} strokeWidth="2" />
        <path d={pathB} fill="none" stroke={colorB} strokeWidth="2" />

        {hoverIndex !== null && (
          <>
            <line
              x1={hoverX}
              y1={0}
              x2={hoverX}
              y2={VIEW_H}
              stroke="#c7cede"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={hoverX} cy={hoverYA} r="3.5" fill="#fff" stroke={colorA} strokeWidth="2" />
            <circle cx={hoverX} cy={hoverYB} r="3.5" fill="#fff" stroke={colorB} strokeWidth="2" />
          </>
        )}
      </svg>

      <div className="flex justify-between mt-1 px-0.5">
        {(xLabels ?? data.map((d) => d.label)).map((l, i) => (
          <span
            key={i}
            className="text-[9px]"
            style={{ color: hoverIndex === i ? "#2d3452" : "#aab1c7" }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}