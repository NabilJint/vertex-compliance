import { type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "completed" | "in-progress" | "recertification-due" | "free-preview" | "default"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, { className: string; style: React.CSSProperties }> = {
  completed: {
    className: "",
    style: { backgroundColor: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0" },
  },
  "in-progress": {
    className: "",
    style: { backgroundColor: "#DBEAFE", color: "#2563EB", border: "1px solid #BFDBFE" },
  },
  "recertification-due": {
    className: "",
    style: { backgroundColor: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" },
  },
  "free-preview": {
    className: "",
    style: { backgroundColor: "#F9FAFB", color: "#475569", border: "1px solid #E5E7EB" },
  },
  default: {
    className: "",
    style: { backgroundColor: "#F9FAFB", color: "#111827", border: "1px solid #E5E7EB" },
  },
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const v = variantStyles[variant]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] leading-[16px] font-medium",
        v.className,
        className
      )}
      style={v.style}
      {...props}
    />
  )
}

export { Badge, type BadgeProps, type BadgeVariant }
