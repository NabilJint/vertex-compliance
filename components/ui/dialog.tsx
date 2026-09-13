"use client"

import { useEffect, useCallback, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

function Dialog({ open, onClose, children, className }: DialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-[16px] bg-white p-6",
          className
        )}
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)} {...props} />
  )
}

function DialogTitle({ className, ...props }: { className?: string; children: ReactNode }) {
  return <h2 className={cn("text-[24px] leading-[32px] font-semibold", className)} style={{ color: "#111827" }} {...props} />
}

function DialogDescription({ className, ...props }: { className?: string; children: ReactNode }) {
  return <p className={cn("text-[16px] leading-[24px] mt-1", className)} style={{ color: "#475569" }} {...props} />
}

function DialogClose({ onClose, className }: { onClose: () => void; className?: string }) {
  return (
    <button
      onClick={onClose}
      className={cn("transition-colors", className)}
      style={{ color: "#94A3B8" }}
    >
      <X className="h-5 w-5" />
    </button>
  )
}

function DialogFooter({ className, ...props }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex justify-end gap-3 mt-6", className)} {...props} />
  )
}

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter }
