"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>")
  return ctx
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("flex gap-0 border-b", className)}
      style={{ borderColor: "#E5E7EB" }}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

function TabsTrigger({ value, children, className }: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 py-2.5 text-[14px] leading-[20px] font-medium transition-colors duration-150 border-b-2 -mb-px",
        className
      )}
      style={{
        borderBottomColor: isActive ? "#3B82F6" : "transparent",
        color: isActive ? "#3B82F6" : "#475569",
      }}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null
  return (
    <div role="tabpanel" className={cn("py-4", className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
