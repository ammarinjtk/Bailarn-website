import type { ComponentType, ReactNode } from 'react'

// The explainer for one demo page. Sections render in this order under "Try it".
export type TaskContent = {
  Demo: ComponentType
  task: ReactNode // what the task is and why it is hard in Thai
  io: ReactNode // input → output, step by step
  architecture: { model: string; intro: ReactNode }[] // one diagram per model the demo runs
  data: ReactNode // training data and published result
  limits: ReactNode[]
}
