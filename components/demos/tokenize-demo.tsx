'use client'

import { useState } from 'react'
import ProofLine from '@/components/proof-line'
import ModelStatus from '@/components/model-status'
import DemoForm from '@/components/demo-form'
import { segment, type CharLabel, type Word } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'

const EXAMPLES = ['นายกรัฐมนตรีเดินทางไปเชียงใหม่', 'สวัสดีตอนเช้าเป็นยังไงบ้างครับ', 'ตากลม']

export default function TokenizeDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [result, setResult] = useState<{ words: Word[]; chars: CharLabel[] } | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer'])
  const busy = status === 'downloading' || status === 'running'

  const analyse = async (input: string) => {
    const out = await run(([{ tf, model }]) => segment(tf, model, input))
    if (out) setResult(out)
  }

  return (
    <div className="flex flex-col gap-4">
      <DemoForm id="tokenize-input" label="Thai text" value={text} onChange={setText} examples={EXAMPLES}
        onExample={(ex) => { setText(ex); analyse(ex) }} onSubmit={() => analyse(text)} busy={busy} max={200} action="Segment" />
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer')} />
      {result && (
        <div className="flex flex-col gap-4 border-t border-rule pt-4" aria-live="polite">
          <output className="font-display text-2xl leading-[1.9]"><ProofLine words={result.words.map((w) => w.text)} /></output>
          <details className="group">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.08em] text-mute hover:text-ink">What the model saw: one label per character</summary>
            <div className="overflow-x-auto mt-3">
              <table className="border-collapse tabular-nums">
                <tbody>
                  <tr>
                    <th scope="row" className="pr-3 text-left font-mono text-[11px] font-normal text-mute">char</th>
                    {result.chars.map((c, i) => <td key={i} lang="th" className={`px-1 text-center font-display text-xl ${c.label !== '·' ? 'bg-tint' : ''}`}>{c.char === ' ' ? '␣' : c.char}</td>)}
                  </tr>
                  <tr>
                    <th scope="row" className="pr-3 text-left font-mono text-[11px] font-normal text-mute">id</th>
                    {result.chars.map((c, i) => <td key={i} className="px-1 text-center font-mono text-[11px] text-mute">{c.id}</td>)}
                  </tr>
                  <tr>
                    <th scope="row" className="pr-3 text-left font-mono text-[11px] font-normal text-mute">label</th>
                    {result.chars.map((c, i) => <td key={i} className={`px-1 text-center font-mono text-[11px] ${c.label !== '·' ? 'bg-tint text-green' : 'text-mute'}`}>{c.label}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-mute mt-2">A label other than · marks the last character of a word; the label itself is the word class the model guessed for that word.</p>
          </details>
        </div>
      )}
    </div>
  )
}
