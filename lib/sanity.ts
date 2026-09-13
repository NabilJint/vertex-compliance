import { readClient } from '../sanity/lib/client'
import {
  ALL_TRAINING_PROGRAMS_QUERY,
  TRAINING_PROGRAM_BY_SLUG_QUERY,
  ALL_LESSONS_QUERY,
  LESSON_BY_SLUG_QUERY,
  ALL_TRAINERS_QUERY,
  TRAINER_BY_SLUG_QUERY,
  ALL_CATEGORIES_QUERY,
  VIDEO_BY_URL_QUERY,
  PROGRESS_BY_USER_QUERY,
} from '../sanity/lib/queries'

// --- Training Programs ---

export async function getAllTrainingPrograms() {
  return readClient.fetch(ALL_TRAINING_PROGRAMS_QUERY)
}

export async function getTrainingProgramBySlug(slug: string) {
  return readClient.fetch(TRAINING_PROGRAM_BY_SLUG_QUERY, { slug })
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

export async function getProgressByUser(userId: string) {
  return readClient.fetch(PROGRESS_BY_USER_QUERY, { userId })
}
