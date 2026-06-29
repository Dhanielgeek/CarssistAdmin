interface BarChartProps {
  data: { month: string; ios: number; android: number; web: number }[]
}

const BarChart = ({ data }: BarChartProps) => {
  const maxVal = Math.max(...data.flatMap(d => [d.ios, d.android, d.web]))
  const chartH = 140
  const barW = 8
  const groupW = 36
  const padL = 32
  const padB = 24
  const width = padL + data.length * groupW + 10

  const yTicks = [0, 10, 20, 30, 40, 50]

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${chartH + padB + 10}`} style={{ overflow: "visible" }}>
      {/* Y grid + labels */}
      {yTicks.map(tick => {
        const y = 10 + chartH - (tick / maxVal) * chartH
        return (
          <g key={tick}>
            <line x1={padL} y1={y} x2={width - 4} y2={y} stroke="#eaecf3" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#8b94b2">{tick}</text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const gx = padL + i * groupW + 2
        const colors = ["#3b82f6", "#22c55e", "#e8a838"]
        const vals = [d.ios, d.android, d.web]
        return (
          <g key={d.month}>
            {vals.map((v, j) => {
              const bh = (v / maxVal) * chartH
              return (
                <rect
                  key={j}
                  x={gx + j * (barW + 1)}
                  y={10 + chartH - bh}
                  width={barW}
                  height={bh}
                  fill={colors[j]}
                  rx="2"
                />
              )
            })}
            <text
              x={gx + (barW * 3 + 2) / 2}
              y={10 + chartH + 14}
              textAnchor="middle"
              fontSize="8.5"
              fill="#8b94b2"
            >
              {d.month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default BarChart