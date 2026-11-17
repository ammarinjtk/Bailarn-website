import type { TaskContent } from './types'
import { tokenize } from './tokenize'
import { entities } from './entities'
import { embeddings } from './embeddings'
import { pos } from './pos'
import { sentiment } from './sentiment'
import { topics } from './topics'

export const CONTENT: Record<string, TaskContent> = { tokenize, entities, embeddings, pos, sentiment, topics }
