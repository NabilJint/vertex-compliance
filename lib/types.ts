export interface SanityImageRef {
  _type: "image"
  asset: { _ref: string; _type: "reference" }
}

export interface SanitySlug {
  _type: "slug"
  current: string
}

export interface PortableTextBlock {
  _key: string
  _type: string
  [key: string]: unknown
}

export interface LearningOutcome {
  _key: string
  icon?: string
  title: string
  description?: string
}

export interface LessonResource {
  _key: string
  type?: string
  title?: string
  description?: string
  url?: string
}

export interface LessonSummary {
  _id: string
  title: string
  slug: SanitySlug
  videoUrl?: string
  posterImage?: SanityImageRef
  duration?: number
  isFreePreview?: boolean
  employeeCount?: number
}

export interface TrainingModule {
  _key: string
  title: string
  summary?: string
  lessons: LessonSummary[]
}

export interface TrainerSummary {
  _id: string
  name: string
  slug?: SanitySlug
  photo?: SanityImageRef
  expertise?: string
  bio?: PortableTextBlock[]
}

export interface CategorySummary {
  _id: string
  title: string
  slug?: SanitySlug
}

export interface TrainingProgram {
  _id: string
  _updatedAt: string
  title: string
  slug: SanitySlug
  summary?: string
  coverImage?: SanityImageRef
  level?: "beginner" | "intermediate" | "advanced"
  requiredBy?: string
  isPopular?: boolean
  employeeCount?: number
  learningOutcomes?: LearningOutcome[]
  trainer: TrainerSummary
  category: CategorySummary
  modules: TrainingModule[]
}

export interface RelatedTrainingProgram {
  _id: string
  title: string
  slug: SanitySlug
  coverImage?: SanityImageRef
  level?: string
  trainer: { _id: string; name: string; photo?: SanityImageRef }
  category: { _id: string; title: string; slug?: SanitySlug }
  lessonDurations: (number | null)[]
}

export type FeaturedTrainingProgram = RelatedTrainingProgram

export interface UserProgress {
  _id: string
  userId: string
  completedLessons: { _id: string; title: string; slug: SanitySlug }[]
  lastPosition?: {
    lesson: { _id: string; title: string; slug: SanitySlug }
    positionSeconds: number
  }
}

export type LessonStatus = "completed" | "in-progress" | "not-started"
