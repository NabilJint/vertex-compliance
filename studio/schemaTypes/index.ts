import { type SchemaTypeDefinition } from 'sanity'

import { category } from './category'
import { trainer } from './trainer'
import { lesson } from './lesson'
import { trainingProgram } from './trainingProgram'
import { video } from './video'
import { agentContext } from './agentContext'
import { progress } from './progress'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    category,
    trainer,
    lesson,
    trainingProgram,
    video,
    agentContext,
    progress,
  ],
}
