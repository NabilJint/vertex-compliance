import { createClient } from 'next-sanity'

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-13'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})
