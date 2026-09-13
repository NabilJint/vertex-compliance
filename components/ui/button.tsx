import { forwardRef, type ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, { className: string; style: React.CSSProperties }> = {
  primary: {
    className: "",
    style: { backgroundColor: "#1E1B4B", color: "#FFFFFF" },
  },
  secondary: {
    className: "border",
    style: { backgroundColor: "#FFFFFF", color: "#111827", borderColor: "#E5E7EB" },
  },
  ghost: {
    className: "",
    style: { backgroundColor: "transparent", color: "#111827" },
  },
  destructive: {
    className: "",
    style: { backgroundColor: "#EF4444", color: "#FFFFFF" },
  },
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[14px] leading-[20px] rounded-[6px]",
  md: "h-10 px-4 text-[16px] leading-[24px] rounded-[10px]",
  lg: "h-12 px-6 text-[16px] leading-[24px] rounded-[10px]",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const v = variantStyles[variant]
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30 disabled:pointer-events-none",
          v.className,
          sizeStyles[size],
          className
        )}
        style={v.style}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize }
