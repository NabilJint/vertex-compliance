import { type HTMLAttributes } from "react"
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "success" | "warning" | "error"

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant
  title: string
  description?: string
  onClose?: () => void
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; style: React.CSSProperties }> = {
  success: {
    icon: CheckCircle2,
    style: { backgroundColor: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" },
  },
  warning: {
    icon: AlertTriangle,
    style: { backgroundColor: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" },
  },
  error: {
    icon: XCircle,
    style: { backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" },
  },
}

function Toast({ variant = "success", title, description, onClose, className, ...props }: ToastProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[10px] p-4",
        className
      )}
      style={{ ...config.style, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>{title}</p>
        {description && (
          <p className="mt-1 text-[12px] leading-[16px]" style={{ color: "#475569" }}>{description}</p>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0" style={{ color: "#94A3B8" }}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export { Toast, type ToastProps, type ToastVariant }
