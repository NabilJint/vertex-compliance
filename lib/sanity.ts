import { readClient, writeClient } from '../sanity/lib/client'
import type { FeaturedTrainingProgram, LessonPageLesson, RelatedTrainingProgram, TrainingProgram, UserProgress, VideoDoc } from '../lib/types'
import {
  ALL_TRAINING_PROGRAMS_QUERY,
  TRAINING_PROGRAM_BY_SLUG_QUERY,
  FEATURED_TRAINING_PROGRAMS_QUERY,
  OTHER_FEATURED_TRAINING_PROGRAMS_QUERY,
  RELATED_TRAINING_PROGRAMS_QUERY,
  OTHER_TRAINING_PROGRAMS_QUERY,
  ALL_LESSONS_QUERY,
  LESSON_BY_SLUG_QUERY,
  LESSON_PAGE_QUERY,
  ALL_TRAINERS_QUERY,
  TRAINER_BY_SLUG_QUERY,
  ALL_CATEGORIES_QUERY,
  VIDEO_BY_URL_QUERY,
  PROGRESS_BY_USER_QUERY,
} from '../sanity/lib/queries'

// --- Training Programs ---

export async function getAllTrainingPrograms(): Promise<RelatedTrainingProgram[]> {
  return readClient.fetch(ALL_TRAINING_PROGRAMS_QUERY)
}

export async function getTrainingProgramBySlug(slug: string): Promise<TrainingProgram | null> {
  return readClient.fetch(TRAINING_PROGRAM_BY_SLUG_QUERY, { slug })
}

export async function getFeaturedTrainingPrograms(): Promise<FeaturedTrainingProgram[]> {
  const featured: FeaturedTrainingProgram[] = await readClient.fetch(FEATURED_TRAINING_PROGRAMS_QUERY)
  if (featured.length >= 4) return featured

  const fallback: FeaturedTrainingProgram[] = await readClient.fetch(OTHER_FEATURED_TRAINING_PROGRAMS_QUERY)
  const seen = new Set(featured.map((program) => program._id))
  const merged = [...featured]
  for (const program of fallback) {
    if (merged.length >= 4) break
    if (!seen.has(program._id)) merged.push(program)
  }
  return merged
}

export async function getRelatedTrainingPrograms(categoryId: string, excludeId: string): Promise<RelatedTrainingProgram[]> {
  const related: RelatedTrainingProgram[] = await readClient.fetch(RELATED_TRAINING_PROGRAMS_QUERY, { categoryId, excludeId })
  if (related.length >= 3) return related

  const fallback: RelatedTrainingProgram[] = await readClient.fetch(OTHER_TRAINING_PROGRAMS_QUERY, { excludeId })
  const seen = new Set(related.map((program) => program._id))
  const merged = [...related]
  for (const program of fallback) {
    if (merged.length >= 3) break
    if (!seen.has(program._id)) merged.push(program)
  }
  return merged
}

// --- Lessons ---

export async function getAllLessons() {
  return readClient.fetch(ALL_LESSONS_QUERY)
}

export async function getLessonBySlug(slug: string) {
  return readClient.fetch(LESSON_BY_SLUG_QUERY, { slug })
}

// --- Trainers ---

export async function getAllTrainers() {
  return readClient.fetch(ALL_TRAINERS_QUERY)
}

export async function getTrainerBySlug(slug: string) {
  return readClient.fetch(TRAINER_BY_SLUG_QUERY, { slug })
}

// --- Categories ---

export async function getAllCategories() {
  return readClient.fetch(ALL_CATEGORIES_QUERY)
}

// --- Videos ---

export async function getVideoByUrl(videoUrl: string) {
  return readClient.fetch(VIDEO_BY_URL_QUERY, { videoUrl })
}

// --- Progress ---

export async function getProgressByUser(userId: string): Promise<UserProgress | null> {
  return readClient.fetch(PROGRESS_BY_USER_QUERY, { userId })
}

// --- Lesson Page ---

export async function getLessonPageBySlug(slug: string): Promise<LessonPageLesson | null> {
  return readClient.fetch(LESSON_PAGE_QUERY, { slug })
}

export async function getVideoDocByUrl(videoUrl: string): Promise<VideoDoc | null> {
  return readClient.fetch(VIDEO_BY_URL_QUERY, { videoUrl })
}

export async function saveProgress(
  userId: string,
  patch: { lessonId?: string; positionSeconds?: number; completed?: boolean }
): Promise<void> {
  const existing = await readClient.fetch<{ _id: string } | null>(
    `*[_type == "progress" && userId == $userId][0]{ _id }`,
    { userId }
  )

  if (!existing) {
    await writeClient.createIfNotExists({
      _type: "progress",
      _id: `progress-${userId}`,
      userId,
      completedLessons: patch.completed && patch.lessonId
        ? [{ _type: "reference", _ref: patch.lessonId }]
        : [],
      lastPosition: patch.lessonId
        ? {
            _type: "lastPosition",
            lesson: { _type: "reference", _ref: patch.lessonId },
            positionSeconds: patch.positionSeconds ?? 0,
          }
        : undefined,
    })
  } else {
    const p = writeClient.patch(existing._id).setIfMissing({ completedLessons: [] })

    if (patch.completed && patch.lessonId) {
      p.append("completedLessons", [{ _type: "reference", _ref: patch.lessonId }])
    }

    if (patch.lessonId && patch.positionSeconds !== undefined) {
      p.set({
        lastPosition: {
          _type: "lastPosition",
          lesson: { _type: "reference", _ref: patch.lessonId },
          positionSeconds: patch.positionSeconds,
        },
      })
    }

    await p.commit()
  }
}
