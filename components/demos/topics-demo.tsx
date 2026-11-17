'use client'

import { useState } from 'react'
import ModelStatus from '@/components/model-status'
import DemoForm from '@/components/demo-form'
import { segment, topics } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'

// Two are posts from the Pantip sample set (numbers are masked as 0 there); one is a short question.
const EXAMPLES = [
  'Dtacgoเพลินไม่ได้รับการต่ออายุ เนื่องจากวันนี้ได้รับsmsว่าเน็ต00kbpsหมดอายุจากโปรdtacgoเพลินหมดอายุ',
  'ถ้าใช้มือถือแค่เล่นเฟสเล่นไลน์โอนเงินเข้าเน็ตแรมเท่าไหร่ถึงจะพอ ช่วยแนะนำมือถือหน่อยจะซื้อใหม่เอาถูกๆ',
  'Asus Zenfone กับ Huawei nova อันไหนดีกว่ากัน',
]
const SHOW = 5

export default function TopicsDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [result, setResult] = useState<{ label: string; p: number }[] | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer', 'categorization'])
  const busy = status === 'downloading' || status === 'running'

  const analyse = async (input: string) => {
    const out = await run(async ([tok, cat]) => {
      const w = (await segment(tok.tf, tok.model, input)).words.map((x) => x.text)
      return (await topics(cat.tf, cat.model, cat.vocab, w)).slice(0, SHOW)
    })
    if (out) setResult(out)
  }

  return (
    <div className="flex flex-col gap-4">
      <DemoForm id="topics-input" label="A Pantip post about phones or mobile networks" value={text} onChange={setText} examples={EXAMPLES}
        onExample={(ex) => { setText(ex); analyse(ex) }} onSubmit={() => analyse(text)} busy={busy} max={800} rows={3} action="Suggest tags" />
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer') + downloadBytes('categorization')} />
      {result && (
        <div className="flex flex-col gap-3 border-t border-rule pt-4" aria-live="polite">
          <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-mute">The model&apos;s {SHOW} most likely tags</h3>
          <ol className="flex flex-col gap-2 max-w-lg">
            {result.map((t) => (
              <li key={t.label} className="grid grid-cols-[minmax(0,12rem)_1fr_3.5rem] items-center gap-3 text-sm">
                <span lang="th" className="truncate">{t.label}</span>
                <span className="h-2 bg-rule rounded-full overflow-hidden" aria-hidden="true"><span className="block h-full bg-leaf rounded-full" style={{ width: `${t.p * 100}%` }} /></span>
                <span className="font-mono tabular-nums text-right">{t.p.toFixed(2)}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm text-mute">Each tag gets its own probability, so they do not add up to 1. Treat these as suggestions: see the results below.</p>
        </div>
      )}
    </div>
  )
}
