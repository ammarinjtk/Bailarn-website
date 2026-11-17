'use client'

import { useState } from 'react'
import ModelStatus from '@/components/model-status'
import { similarity } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'

const EXAMPLES: [string, string, string][] = [
  ['แม่', 'พ่อ', 'เพื่อนบ้าน'],
  ['วันเสาร์', 'วันอังคาร', 'ดวงจันทร์'],
  ['กิน', 'เก้าอี้', 'รับประทาน'],
]
type Pair = { a: string; b: string; score: number | null }

export default function EmbeddingsDemo() {
  const [words, setWords] = useState<string[]>(EXAMPLES[0])
  const [pairs, setPairs] = useState<Pair[] | null>(null)
  const { status, progress, error, run } = useModels(['word_embedder'])
  const busy = status === 'downloading' || status === 'running'
  const filled = words.map((w) => w.trim())
  const missing = filled.findIndex((w) => !w)

  const analyse = async (input: string[]) => {
    const out = await run(async ([{ tf, model, vocab }]) => {
      const list: Pair[] = []
      for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) list.push({ a: input[i], b: input[j], score: await similarity(tf, model, vocab, input[i], input[j]) })
      return list
    })
    if (out) setPairs(out)
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (missing < 0) analyse(filled) }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {words.map((w, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label htmlFor={`word-${i}`} className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Word {i + 1}</label>
              <input id={`word-${i}`} lang="th" value={w} maxLength={30} aria-invalid={!w.trim()}
                onChange={(e) => setWords(words.map((x, k) => (k === i ? e.target.value : x)))}
                className={`font-display text-xl bg-paper border rounded-sm px-3 py-2 outline-none focus:border-ink ${!w.trim() ? 'border-danger' : 'border-rule'}`} />
              {!w.trim() && <span className="text-xs text-danger">Enter a word</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.join()} type="button" lang="th" disabled={busy} onClick={() => { setWords(ex); analyse(ex) }}
                className="font-display text-sm px-2.5 py-1 border border-rule rounded-sm hover:border-ink disabled:opacity-50">{ex.join(' · ')}</button>
            ))}
          </div>
          <button type="submit" disabled={busy || missing >= 0} className="h-10 px-5 rounded-sm bg-ink text-paper font-medium hover:bg-green disabled:opacity-40 disabled:hover:bg-ink">Compare</button>
        </div>
      </form>
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('word_embedder')} />
      {status === 'idle' && <p className="text-sm text-mute">This is the largest model on the site. On mobile data, Wi-Fi is a good idea.</p>}
      {pairs && (
        <ul className="flex flex-col gap-3 border-t border-rule pt-4" aria-live="polite">
          {pairs.map((p) => (
            <li key={p.a + p.b} className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3">
              <span lang="th" className="font-display text-lg truncate">{p.a} ↔ {p.b}</span>
              {p.score === null ? (
                <span className="text-sm text-mute col-span-2">A word is not in the model&apos;s vocabulary</span>
              ) : (
                <>
                  <span className="h-2 bg-rule rounded-full overflow-hidden" aria-hidden="true">
                    <span className="block h-full bg-leaf rounded-full" style={{ width: `${Math.max(0, p.score) * 100}%` }} />
                  </span>
                  <span className="font-mono text-sm tabular-nums">{p.score.toFixed(3)}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
