export interface VideoResult {
  type: "video"
  trainingProgram: { name: string; slug: string }
  moduleLabel: string
  lessonLabel: string
  lessonSlug: string
  thumbnail?: string
  clipLength: string
  description: string
  matchedSecond: number
}

export interface LessonResult {
  type: "lesson"
  trainingProgram: { name: string; slug: string }
  moduleLabel: string
  lessonLabel: string
  lessonSlug: string
  keyPoints: string[]
  description: string
}

export type SearchResult = VideoResult | LessonResult

export interface SearchResponse {
  query: string
  totalCount: number
  results: SearchResult[]
}
