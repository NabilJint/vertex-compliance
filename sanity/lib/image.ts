import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
