interface Slice {
  value: number
  color: string
  label: string
}

interface PieChartProps {
  data: Slice[]
  size?: number
  innerRadius?: number
  title?: string
}

const PieChart = ({ data, size = 120, innerRadius = 0, title }: PieChartProps) => {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4
  const total = data.reduce((s, d) => s + d.value, 0)

  let cumAngle = -Math.PI / 2

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI
    const start = cumAngle
    const end = cumAngle + angle
    cumAngle += angle

    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)

    const ix1 = cx + innerRadius * Math.cos(start)
    const iy1 = cy + innerRadius * Math.sin(start)
    const ix2 = cx + innerRadius * Math.cos(end)
    const iy2 = cy + innerRadius * Math.sin(end)

    const largeArc = angle > Math.PI ? 1 : 0

    const path = innerRadius > 0
      ? `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return { ...d, path }
  })

  return (
    <div className="flex flex-col items-center gap-2">
      {title && <p className="text-xs font-semibold text-center" style={{ color: "#555e7a" }}>{title}</p>}
      <svg width={size} height={size}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="rounded-sm shrink-0" style={{ width: 8, height: 8, background: d.color }} />
            <span className="text-xs" style={{ color: "#8b94b2" }}>{d.label} {Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart