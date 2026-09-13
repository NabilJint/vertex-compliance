import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'

export const agentContext = defineType({
  name: 'agentContext',
  title: 'Agent Context',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'contentScope',
      title: 'Content Scope',
      type: 'text',
      description: 'Filter that limits visible types to content documents',
    }),
    defineField({
      name: 'instructions',
      title: 'Instructions',
      type: 'text',
      description: 'Query guidance for the search agent',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Agent Context' }
    },
  },
})
