import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentsIcon } from '@sanity/icons/Documents'

export const progress = defineType({
  name: 'progress',
  title: 'Progress',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completedLessons',
      title: 'Completed Lessons',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'lesson' }] })],
    }),
    defineField({
      name: 'lastPosition',
      title: 'Last Position',
      type: 'object',
      fields: [
        defineField({
          name: 'lesson',
          title: 'Lesson',
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
        defineField({
          name: 'positionSeconds',
          title: 'Position (seconds)',
          type: 'number',
          validation: (rule) => rule.min(0),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'userId' },
  },
})
