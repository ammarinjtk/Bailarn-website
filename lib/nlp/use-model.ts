'use client'

import { useCallback, useState } from 'react'
import { loadModel, nextFrame, type Loaded, type ModelName, type Progress } from './runtime.ts'

export type Status = 'idle' | 'downloading' | 'running' | 'done' | 'error'

/** Runs `job` with the named models, loading them on first use and exposing download progress and status. */
export function useModels(names: ModelName[]) {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState<Progress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async <T,>(job: (models: Loaded[]) => Promise<T>): Promise<T | undefined> => {
      setError(null)
      try {
        const parts = new Map<ModelName, Progress>()
        setStatus('downloading')
        const models = await Promise.all(
          names.map((n) =>
            loadModel(n, (p) => {
              parts.set(n, p)
              const all = [...parts.values()]
              setProgress({ loaded: all.reduce((s, x) => s + x.loaded, 0), total: all.reduce((s, x) => s + x.total, 0) })
            }),
          ),
        )
        setStatus('running')
        await nextFrame()
        const result = await job(models)
        setStatus('done')
        return result
      } catch (e) {
        console.error(e)
        setError('The model could not be loaded. Check your connection and try again.')
        setStatus('error')
      }
    },
    // names is a constant list per demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return { status, progress, error, run }
}
