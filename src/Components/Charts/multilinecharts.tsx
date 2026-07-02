import { useRef, useState } from "react"

type Series = { key: string; color: string; label: string }

type Props = {
  data: Record<string, any>[]
  series: Series[]
  yMax?: number
  yTicks?: number[]
  tooltip?: (point: Record<string, any>, index: number) => React.ReactNode
  markers?: { index: number; seriesKey: string; color?: string }[]
}

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

const VIEW_W = 760
const VIEW_H = 260
const PAD_Y = 12
const PAD_LEFT = 36

export default function MultiLineChart({
  data,
  series,
  yMax = 400,
  yTicks = [0, 100, 200, 300, 400],
  tooltip,
  markers = [],
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const plotW = VIEW_W - PAD_LEFT
  const stepX = plotW / (data.length - 1)
  const yFor = (v: number) => VIEW_H - PAD_Y - (v / yMax) * (VIEW_H - PAD_Y * 2)

  const seriesPoints = series.map((s) => ({
    ...s,
    points: data.map((d, i) => ({ x: PAD_LEFT + i * stepX, y: yFor(d[s.key]) })),
  }))

  const handleMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VIEW_W - PAD_LEFT
    let idx = Math.round(relX / stepX)
    idx = Math.max(0, Math.min(data.length - 1, idx))
    setHoverIndex(idx)
  }

  const hoverX = hoverIndex !== null ? PAD_LEFT + hoverIndex * stepX : 0
  const leftPct = (hoverX / VIEW_W) * 100
  const clampedLeftPct = Math.min(84, Math.max(16, leftPct))

  return (
    <div className="relative w-full select-none">
      {hoverIndex !== null && tooltip && (
        <div
          className="absolute z-10 rounded-lg bg-[#14161f] px-3 py-2 text-white text-[11px] leading-tight pointer-events-none shadow-lg"
          style={{ left: `${clampedLeftPct}%`, top: 0, transform: "translate(-50%, -8px)" }}
        >
          {tooltip(data[hoverIndex], hoverIndex)}
          <div
            className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#14161f]"
            style={{ transform: "translateX(-50%) rotate(45deg)" }}
          />
        </div>
      )}

      <div className="flex">
        <div className="flex flex-col justify-between text-[10px] pr-2" style={{ color: "#aab1c7", height: VIEW_H }}>
          {[...yTicks].reverse().map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full overflow-visible"
          style={{ height: VIEW_H }}
          preserveAspectRatio="none"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {yTicks.map((t) => (
            <line
              key={t}
              x1={PAD_LEFT}
              x2={VIEW_W}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="#f0f2f7"
              strokeWidth={1}
            />
          ))}

          {seriesPoints.map((s) => (
            <path key={s.key} d={smoothPath(s.points)} fill="none" stroke={s.color} strokeWidth={2.5} />
          ))}

          {hoverIndex !== null && (
            <line
              x1={hoverX}
              y1={0}
              x2={hoverX}
              y2={VIEW_H}
              stroke="#e5484d"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {hoverIndex !== null &&
            seriesPoints.map((s) => (
              <circle
                key={s.key}
                cx={s.points[hoverIndex].x}
                cy={s.points[hoverIndex].y}
                r={4}
                fill="#fff"
                stroke={s.color}
                strokeWidth={2}
              />
            ))}

          {markers.map((m, i) => {
            const s = seriesPoints.find((sp) => sp.key === m.seriesKey)
            if (!s) return null
            const p = s.points[m.index]
            return (
              <rect
                key={i}
                x={p.x - 4}
                y={yFor(100) - 4}
                width={8}
                height={8}
                fill={m.color ?? "#e5484d"}
              />
            )
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-1" style={{ marginLeft: PAD_LEFT + 14 }}>
        {data.map((d, i) => (
          <span
            key={i}
            className="text-[10px]"
            style={{ color: hoverIndex === i ? "#2d3452" : "#aab1c7" }}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}