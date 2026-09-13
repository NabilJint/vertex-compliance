import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const inputStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  color: "#111827",
  borderColor: "#E5E7EB",
}

const focusRing = "focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"

/* ─── Input ─── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-10 w-full rounded-[10px] border px-3 text-[16px] leading-[24px]",
            focusRing,
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30",
            className
          )}
          style={inputStyle}
          {...props}
        />
        {error && <p className="text-[12px] leading-[16px]" style={{ color: "#EF4444" }}>{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

/* ─── SearchInput ─── */

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "h-12 w-full rounded-[16px] border py-3 pl-10 pr-10 text-[16px] leading-[24px]",
            focusRing,
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={inputStyle}
          {...props}
        />
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
          style={{ color: "#94A3B8" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

/* ─── Textarea ─── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "min-h-[80px] w-full rounded-[10px] border px-3 py-2 text-[16px] leading-[24px]",
            focusRing,
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30",
            className
          )}
          style={inputStyle}
          {...props}
        />
        {error && <p className="text-[12px] leading-[16px]" style={{ color: "#EF4444" }}>{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

/* ─── Select ─── */

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  placeholder?: string
  options: { value: string; label: string }[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, placeholder, options, error, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[14px] leading-[20px] font-medium" style={{ color: "#111827" }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-[10px] border px-3 text-[16px] leading-[24px]",
            focusRing,
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30",
            className
          )}
          style={inputStyle}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[12px] leading-[16px]" style={{ color: "#EF4444" }}>{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, SearchInput, Textarea, Select }
