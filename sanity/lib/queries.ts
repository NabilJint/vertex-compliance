import { defineQuery } from 'groq'

// --- Training Programs ---

export const ALL_TRAINING_PROGRAMS_QUERY = defineQuery(`
  *[_type == "trainingProgram"] | order(title asc) {
    _id,
    title,
    slug,
    coverImage,
    level,
    trainer-> {
      _id,
      name,
      photo
    },
    category-> {
      _id,
      title,
      slug
    },
    "lessonDurations": modules[].lessons[]->duration
  }
`)

export const TRAINING_PROGRAM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "trainingProgram" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    slug,
    summary,
    coverImage,
    level,
    requiredBy,
    isPopular,
    employeeCount,
    learningOutcomes[] {
      _key,
      icon,
      title,
      description
    },
    trainer-> {
      _id,
      name,
      slug,
      photo,
      expertise,
      bio
    },
    category-> {
      _id,
      title,
      slug
    },
    modules[] {
      _key,
      title,
      summary,
      lessons[]-> {
        _id,
        title,
        slug,
        videoUrl,
        posterImage,
        duration,
        isFreePreview,
        employeeCount
      }
    }
  }
`)

export const FEATURED_TRAINING_PROGRAMS_QUERY = defineQuery(`
  *[_type == "trainingProgram" && isPopular == true] | order(requiredBy asc) [0...4] {
    _id,
    title,
    slug,
    coverImage,
    level,
    trainer-> {
      _id,
      name,
      photo
    },
    category-> {
      _id,
      title,
      slug
    },
    "lessonDurations": modules[].lessons[]->duration
  }
`)

export const OTHER_FEATURED_TRAINING_PROGRAMS_QUERY = defineQuery(`
  *[_type == "trainingProgram" && isPopular != true] | order(requiredBy asc) [0...4] {
    _id,
    title,
    slug,
    coverImage,
    level,
    trainer-> {
      _id,
      name,
      photo
    },
    category-> {
      _id,
      title,
      slug
    },
    "lessonDurations": modules[].lessons[]->duration
  }
`)

export const RELATED_TRAINING_PROGRAMS_QUERY = defineQuery(`
  *[_type == "trainingProgram" && _id != $excludeId && category._ref == $categoryId] | order(title asc) [0...3] {
    _id,
    title,
    slug,
    coverImage,
    level,
    trainer-> {
      _id,
      name,
      photo
    },
    category-> {
      _id,
      title,
      slug
    },
    "lessonDurations": modules[].lessons[]->duration
  }
`)

export const OTHER_TRAINING_PROGRAMS_QUERY = defineQuery(`
  *[_type == "trainingProgram" && _id != $excludeId] | order(title asc) [0...3] {
    _id,
    title,
    slug,
    coverImage,
    level,
    trainer-> {
      _id,
      name,
      photo
    },
    category-> {
      _id,
      title,
      slug
    },
    "lessonDurations": modules[].lessons[]->duration
  }
`)

// --- Lessons ---

export const ALL_LESSONS_QUERY = defineQuery(`
  *[_type == "lesson"] | order(title asc) {
    _id,
    title,
    slug,
    videoUrl,
    posterImage,
    duration,
    isFreePreview,
    employeeCount
  }
`)

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    videoUrl,
    posterImage,
    duration,
    isFreePreview,
    employeeCount,
    notes,
    keyPoints,
    proTip,
    resources[] {
      _key,
      type,
      title,
      description,
      url
    }
  }
`)

// --- Trainers ---

export const ALL_TRAINERS_QUERY = defineQuery(`
  *[_type == "trainer"] | order(name asc) {
    _id,
    name,
    slug,
    photo,
    expertise
  }
`)

export const TRAINER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "trainer" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    expertise,
    bio
  }
`)

// --- Categories ---

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`)

// --- Videos ---

export const VIDEO_BY_URL_QUERY = defineQuery(`
  *[_type == "video" && videoUrl == $videoUrl][0] {
    _id,
    videoId,
    videoUrl,
    chapters[] {
      _key,
      startSeconds,
      label
    },
    chunks[] {
      _key,
      startSeconds,
      text
    }
  }
`)

// --- Lesson Page (lesson + reverse-referenced program) ---

export const LESSON_PAGE_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    videoUrl,
    posterImage,
    duration,
    isFreePreview,
    employeeCount,
    notes,
    keyPoints,
    proTip,
    resources[] {
      _key,
      type,
      title,
      description,
      url
    },
    "program": *[_type == "trainingProgram" && references(^._id)][0] {
      _id,
      title,
      slug,
      requiredBy,
      category-> {
        _id,
        title,
        slug
      },
      modules[] {
        _key,
        title,
        summary,
        lessons[]-> {
          _id,
          title,
          slug,
          videoUrl,
          posterImage,
          duration,
          isFreePreview,
          employeeCount
        }
      }
    }
  }
`)

// --- Agent Context ---

export const AGENT_CONTEXT_QUERY = defineQuery(`
  *[_type == "agentContext"][0] {
    _id,
    contentScope,
    instructions
  }
`)

// --- Progress ---

export const PROGRESS_BY_USER_QUERY = defineQuery(`
  *[_type == "progress" && userId == $userId][0] {
    _id,
    userId,
    completedLessons[]-> {
      _id,
      title,
      slug
    },
    lastPosition {
      lesson-> {
        _id,
        title,
        slug
      },
      positionSeconds
    }
  }
`)
