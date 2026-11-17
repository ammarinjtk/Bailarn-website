'use client'

import { useState } from 'react'
import ModelStatus from '@/components/model-status'
import DemoForm from '@/components/demo-form'
import { partOfSpeech, segment, type Word } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'
import { POS_FAMILIES, POS_FAMILY_OF } from '@/lib/nlp/pos-tags'

const EXAMPLES = ['เราจะไปเดินเล่นที่หนองคาย', 'แมวสามตัวนอนอยู่บนโต๊ะ', 'ความสุขของฉันคือการได้กินข้าวกับครอบครัว']
const DESCRIBE: Record<string, string | null> = Object.fromEntries(POS_FAMILIES.flatMap((f) => f.tags))

export default function PosDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [words, setWords] = useState<Word[] | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer', 'pos'])
  const busy = status === 'downloading' || status === 'running'

  const analyse = async (input: string) => {
    const out = await run(async ([tok, pos]) => {
      const w = (await segment(tok.tf, tok.model, input)).words.map((x) => x.text)
      return partOfSpeech(pos.tf, pos.model, pos.vocab, w)
    })
    if (out) setWords(out)
  }

  return (
    <div className="flex flex-col gap-4">
      <DemoForm id="pos-input" label="Thai text" value={text} onChange={setText} examples={EXAMPLES}
        onExample={(ex) => { setText(ex); analyse(ex) }} onSubmit={() => analyse(text)} busy={busy} max={200} action="Tag words" />
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer') + downloadBytes('pos')} />
      {words && (
        <div className="flex flex-col gap-3 border-t border-rule pt-4" aria-live="polite">
          <ol className="flex flex-wrap gap-x-1 gap-y-3">
            {words.map((w, i) => (
              <li key={i} className="flex flex-col items-center px-1.5" title={[POS_FAMILY_OF[w.tag ?? ''], DESCRIBE[w.tag ?? '']].filter(Boolean).join(': ')}>
                <span lang="th" className="font-display text-2xl leading-snug">{w.text}</span>
                <span className="font-mono text-[11px] text-blue border-t-2 border-blue px-1">{w.tag}</span>
              </li>
            ))}
          </ol>
          <p className="text-sm text-mute">
            {[...new Set(words.map((w) => w.tag))].map((t) => `${t}: ${DESCRIBE[t ?? ''] ?? POS_FAMILY_OF[t ?? ''] ?? '?'}`).join(' · ')}
          </p>
        </div>
      )}
    </div>
  )
}
