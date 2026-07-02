type CarThumbProps = {
  color?: string
  className?: string
}

// Generic side-profile car silhouette — deliberately not modeled on any real make/model.
export default function CarThumb({ color = "#8b94b2", className = "" }: CarThumbProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 40
           C 10 30, 18 26, 28 24
           L 38 14
           C 42 10, 50 8, 58 8
           L 76 8
           C 84 8, 90 11, 94 16
           L 102 24
           C 110 25, 116 29, 117 36
           L 117 42
           C 117 45, 115 47, 112 47
           L 106 47
           C 106 41, 101 36, 95 36
           C 89 36, 84 41, 84 47
           L 44 47
           C 44 41, 39 36, 33 36
           C 27 36, 22 41, 22 47
           L 15 47
           C 12 47, 11 44, 12 40 Z"
        fill={color}
      />
      <path
        d="M40 22 L46 14 C 48.5 11 52 10 56 10 L58 10 L58 22 Z"
        fill="rgba(255,255,255,0.35)"
      />
      <path
        d="M62 10 L76 10 C 82 10 87 12.5 90 16 L96 22 L62 22 Z"
        fill="rgba(255,255,255,0.35)"
      />
      <circle cx="33" cy="47" r="7" fill="#2d3452" />
      <circle cx="33" cy="47" r="3" fill="#c7cede" />
      <circle cx="95" cy="47" r="7" fill="#2d3452" />
      <circle cx="95" cy="47" r="3" fill="#c7cede" />
    </svg>
  )
}