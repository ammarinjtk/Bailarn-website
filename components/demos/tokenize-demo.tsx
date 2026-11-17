'use client'

import { useState } from 'react'
import ProofLine from '@/components/proof-line'
import ModelStatus from '@/components/model-status'
import { segment, type Word } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'

const EXAMPLES = ['นายกรัฐมนตรีเดินทางไปเชียงใหม่', 'สวัสดีตอนเช้าเป็นยังไงบ้างครับ', 'ตากลม']
const MAX = 200

export default function TokenizeDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [words, setWords] = useState<Word[] | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer'])
  const busy = status === 'downloading' || status === 'running'
  const empty = text.trim().length === 0

  const analyse = async (input = text) => {
    const out = await run(([{ tf, model }]) => segment(tf, model, input))
    if (out) setWords(out.words)
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (!empty) analyse() }}>
        <label htmlFor="tokenize-input" className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Thai text</label>
        <textarea id="tokenize-input" lang="th" rows={2} maxLength={MAX} value={text} onChange={(e) => setText(e.target.value)}
          className="font-display text-xl leading-relaxed bg-paper border border-rule rounded-sm px-3 py-2 focus:border-ink outline-none resize-y" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" lang="th" onClick={() => { setText(ex); analyse(ex) }} disabled={busy}
                className="font-display text-sm px-2.5 py-1 border border-rule rounded-sm hover:border-ink disabled:opacity-50">{ex}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-mute tabular-nums">{[...text].length} / {MAX}</span>
            <button type="submit" disabled={busy || empty} className="h-10 px-5 rounded-sm bg-ink text-paper font-medium hover:bg-green disabled:opacity-40 disabled:hover:bg-ink">Segment</button>
          </div>
        </div>
        {empty && <p className="text-sm text-mute">Type some Thai text to segment.</p>}
      </form>
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer')} />
      {words && (
        <output className="font-display text-2xl leading-[1.9] border-t border-rule pt-4" aria-live="polite">
          <ProofLine words={words.map((w) => w.text)} />
        </output>
      )}
    </div>
  )
}
