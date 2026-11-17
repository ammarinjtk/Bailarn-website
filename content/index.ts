import type { TaskContent } from './types'
import { tokenize } from './tokenize'
import { entities } from './entities'
import { embeddings } from './embeddings'

export const CONTENT: Record<string, TaskContent> = { tokenize, entities, embeddings }
