import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_SANITY_PROJECT_ID'

export default defineConfig({
  name: 'stanley-munyao-tech',
  title: 'Stanley Munyao Tech',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
