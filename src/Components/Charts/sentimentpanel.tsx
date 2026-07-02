type SentimentBarProps = {
  label: string
  value: number // 0-100, position of the handle along the track
  trackColor: string
  handleColor: string
}

export function SentimentBar({ label, value, trackColor, handleColor }: SentimentBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-14 shrink-0" style={{ color: "#8b94b2" }}>
        {label}
      </span>
      <div className="relative flex-1 h-1.5 rounded-full" style={{ background: trackColor }}>
        <div
          className="absolute top-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
          style={{
            left: `${value}%`,
            background: handleColor,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  )
}

type SentimentPanelProps = {
  totalLabel: string
  positive: { value: number; reviews: string }
  neutral: { value: number; reviews: string }
  negative: { value: number; reviews: string }
}

export default function SentimentPanel({ totalLabel, positive, neutral, negative }: SentimentPanelProps) {
  return (
    <div className="rounded-xl p-5 bg-white shadow-sm border h-full" style={{ borderColor: "#eaecf3" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ color: "#2d3452" }}>
          Feedback Sentiment Analysis
        </p>
        <span className="text-sm font-semibold" style={{ color: "#2d3452" }}>
          {totalLabel}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        <SentimentBar label="Positive" value={positive.value} trackColor="#fbe7b8" handleColor="#e8a838" />
        <SentimentBar label="Neutral" value={neutral.value} trackColor="#cfe0fb" handleColor="#0057b8" />
        <SentimentBar label="Negative" value={negative.value} trackColor="#f9d3d3" handleColor="#e5484d" />
      </div>

      <div className="flex flex-col gap-1 mt-6 text-xs" style={{ color: "#4a5474" }}>
        <p>Positive: {positive.reviews} Reviews</p>
        <p>Neutral: {neutral.reviews} Reviews</p>
        <p>Negative: {negative.reviews} Reviews</p>
      </div>
    </div>
  )
}