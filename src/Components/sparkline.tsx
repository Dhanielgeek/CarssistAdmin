interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  width?: number
}

const Sparkline = ({ data, color = "#e8a838", height = 36, width = 80 }: SparklineProps) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pad = 2

  const points = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (width - pad * 2)
      const y = pad + ((max - v) / range) * (height - pad * 2)
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Sparkline