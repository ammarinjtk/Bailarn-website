'use client'

import { useState } from 'react'
import ModelStatus from '@/components/model-status'
import DemoForm from '@/components/demo-form'
import { segment, sentiment } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'

const EXAMPLES = ['อาหารอร่อย บริการดี จะกลับมาอีก', 'รอนานมาก อาหารเย็นชืด ไม่กลับมาอีกแน่นอน', 'อร่อย!!! เดินผ่าน Digital gateway ทุกวัน ไม่ยักรู้ว่ามีร้านนี้']
const LABEL: Record<string, string> = { POS: 'Positive', NEG: 'Negative' }

export default function SentimentDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [result, setResult] = useState<{ scores: { label: string; p: number }[]; words: number } | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer', 'sentiment'])
  const busy = status === 'downloading' || status === 'running'

  const analyse = async (input: string) => {
    const out = await run(async ([tok, sen]) => {
      const w = (await segment(tok.tf, tok.model, input)).words.map((x) => x.text)
      return { scores: await sentiment(sen.tf, sen.model, sen.vocab, w), words: w.length }
    })
    if (out) setResult(out)
  }

  const top = result && [...result.scores].sort((a, b) => b.p - a.p)[0]

  return (
    <div className="flex flex-col gap-4">
      <DemoForm id="sentiment-input" label="A short review in Thai" value={text} onChange={setText} examples={EXAMPLES}
        onExample={(ex) => { setText(ex); analyse(ex) }} onSubmit={() => analyse(text)} busy={busy} max={400} rows={3} action="Read the tone" />
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer') + downloadBytes('sentiment')} />
      {result && top && (
        <div className="flex flex-col gap-3 border-t border-rule pt-4" aria-live="polite">
          <output className="text-2xl font-semibold">{LABEL[top.label]} <span className="font-mono text-base font-normal text-mute">{(top.p * 100).toFixed(0)}%</span></output>
          <ul className="flex flex-col gap-2 max-w-md">
            {result.scores.map((s) => (
              <li key={s.label} className="grid grid-cols-[6rem_1fr_3.5rem] items-center gap-3 text-sm">
                <span>{LABEL[s.label]}</span>
                <span className="h-2 bg-rule rounded-full overflow-hidden" aria-hidden="true"><span className={`block h-full rounded-full ${s.label === 'POS' ? 'bg-leaf' : 'bg-mute'}`} style={{ width: `${s.p * 100}%` }} /></span>
                <span className="font-mono tabular-nums text-right">{s.p.toFixed(3)}</span>
              </li>
            ))}
          </ul>
          {result.words > 60 && <p className="text-sm text-mute">The model read the first 60 of {result.words} words.</p>}
        </div>
      )}
    </div>
  )
}
