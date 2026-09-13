import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('trainingProgram').title('Training Programs'),
      S.documentTypeListItem('lesson').title('Lessons'),
      S.documentTypeListItem('trainer').title('Trainers'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('video').title('Videos'),
      S.divider(),
      S.listItem()
        .title('Agent Context')
        .child(
          S.document()
            .schemaType('agentContext')
            .documentId('agentContext')
        ),
      S.divider(),
      S.documentTypeListItem('progress').title('Progress'),
    ])
