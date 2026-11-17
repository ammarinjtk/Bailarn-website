// Browser side: load TensorFlow.js and a model only when a visitor first asks for a result,
// report download progress in bytes, and keep loaded models for the rest of the visit.
import sizes from './model-sizes.json' with { type: 'json' }
import type { Vocab } from './pipeline.ts'

export type ModelName = keyof typeof sizes
type TF = typeof import('@tensorflow/tfjs')
type Model = import('@tensorflow/tfjs').LayersModel
export type Progress = { loaded: number; total: number }
export type Loaded = { tf: TF; model: Model; vocab: Vocab }

let tfPromise: Promise<TF> | null = null
const cache = new Map<ModelName, Promise<Loaded>>()

export const downloadBytes = (name: ModelName) => sizes[name].weights + sizes[name].vocab

function loadTf(): Promise<TF> {
  tfPromise ??= import('@tensorflow/tfjs').then(async (tf) => {
    // These are small recurrent and convolutional models. On WebGL every LSTM timestep is a round of tiny GPU kernels,
    // which took 14 s for one 30-character sentence on an M3; the CPU backend does the same in well under a second.
    await tf.setBackend('cpu')
    await tf.ready()
    return tf
  })
  return tfPromise
}

async function fetchJson(url: string, onBytes: (n: number) => void): Promise<Vocab> {
  const res = await fetch(url)
  if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    received += value.length
    onBytes(received)
  }
  return JSON.parse(text + decoder.decode())
}

/** Loads a model (and its vocabulary) once per visit. A failed load is forgotten, so the next call retries. */
export function loadModel(name: ModelName, onProgress?: (p: Progress) => void): Promise<Loaded> {
  const cached = cache.get(name)
  if (cached) return cached

  const { weights, vocab } = sizes[name]
  const total = weights + vocab
  let weightBytes = 0
  let vocabBytes = 0
  // The browser counts decoded vocab bytes, which match the file size; the clamp only guards rounding.
  const report = () => onProgress?.({ loaded: Math.min(weightBytes + vocabBytes, total), total })

  const promise = (async () => {
    const tf = await loadTf()
    const [model, words] = await Promise.all([
      tf.loadLayersModel(`/models/${name}/model.json`, {
        onProgress: (fraction) => {
          weightBytes = fraction * weights
          report()
        },
      }),
      vocab
        ? fetchJson(`/models/${name}/vocab.json`, (n) => {
            vocabBytes = Math.min(n, vocab)
            report()
          })
        : Promise.resolve({} as Vocab),
    ])
    return { tf, model, vocab: words }
  })()

  cache.set(name, promise)
  promise.catch(() => cache.delete(name))
  return promise
}

/** Lets the browser paint a "working" state before a model call blocks the main thread.
 *  Capped at 50 ms: a background tab gets no animation frames, and the run must not wait for the visitor to come back. */
export function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 50)
    requestAnimationFrame(() => {
      clearTimeout(timer)
      setTimeout(resolve, 0)
    })
  })
}
