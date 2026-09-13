import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  variant?: "linear" | "circular"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

function Progress({ value, max = 100, variant = "linear", size = "md", showLabel, className }: ProgressProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100)

  if (variant === "circular") {
    const sizes = { sm: 48, md: 64, lg: 96 }
    const strokes = { sm: 4, md: 5, lg: 6 }
    const s = sizes[size]
    const stroke = strokes[size]
    const radius = (s - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg width={s} height={s} className="-rotate-90">
          <circle
            cx={s / 2}
            cy={s / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          <circle
            cx={s / 2}
            cy={s / 2}
            r={radius}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-200 ease-out"
          />
        </svg>
        {showLabel && (
          <span className="absolute text-[14px] leading-[20px] font-semibold" style={{ color: "#111827" }}>{percent}%</span>
        )}
      </div>
    )
  }

  const heights = { sm: 4, md: 6, lg: 8 }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>{percent}%</span>
        </div>
      )}
      <div
        className="w-full overflow-hidden rounded-full"
        style={{ height: heights[size], backgroundColor: "#E5E7EB" }}
      >
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{ width: `${percent}%`, backgroundColor: "#3B82F6" }}
        />
      </div>
    </div>
  )
}

export { Progress, type ProgressProps }
