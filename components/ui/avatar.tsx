import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeStyles = {
  sm: "h-8 w-8 text-[12px]",
  md: "h-10 w-10 text-[14px]",
  lg: "h-14 w-14 text-[16px]",
}

function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const initials = fallback || alt?.charAt(0)?.toUpperCase() || "?"

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium",
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: "#1E1B4B", color: "#FFFFFF" }}
    >
      {src ? (
        <img src={src} alt={alt || ""} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

function AvatarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex -space-x-2", className)}>
      {children}
    </div>
  )
}

export { Avatar, AvatarGroup, type AvatarProps }
