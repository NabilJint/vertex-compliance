const CATEGORY_COLORS: Record<string, string> = {
  cybersecurity: "#3B82F6",
  "data-privacy-protection": "#10B981",
  "workplace-safety": "#F59E0B",
  "financial-compliance": "#8B5CF6",
  "ethics-conduct": "#EC4899",
}

const FALLBACK_COLOR = "#64748B"

export function getCategoryColor(categorySlug?: string): string {
  if (!categorySlug) return FALLBACK_COLOR
  return CATEGORY_COLORS[categorySlug] || FALLBACK_COLOR
}
