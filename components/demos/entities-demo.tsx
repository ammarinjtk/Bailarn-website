'use client'

import { useState } from 'react'
import ModelStatus from '@/components/model-status'
import DemoForm from '@/components/demo-form'
import { entities, segment, type Entity } from '@/lib/nlp/pipeline.ts'
import { downloadBytes } from '@/lib/nlp/runtime.ts'
import { useModels } from '@/lib/nlp/use-model.ts'
import { ENTITY_TYPES } from '@/lib/nlp/entity-types'

const EXAMPLES = ['สถานที่ที่คุณสมชายชอบไปคือเกาหลีใต้', 'อาหารกล่องที่ไทยราคาเพียง 20 บาท', 'เราจะไปเดินเล่นที่หนองคาย และนั่งเรือข้ามไปประเทศลาว']

export default function EntitiesDemo() {
  const [text, setText] = useState(EXAMPLES[0])
  const [result, setResult] = useState<{ words: string[]; tags: string[]; spans: (Entity | string)[] } | null>(null)
  const { status, progress, error, run } = useModels(['tokenizer', 'ner'])
  const busy = status === 'downloading' || status === 'running'

  const analyse = async (input: string) => {
    const out = await run(async ([tok, ner]) => {
      const words = (await segment(tok.tf, tok.model, input)).words.map((w) => w.text)
      return { words, ...(await entities(ner.tf, ner.model, ner.vocab, words)) }
    })
    if (out) setResult(out)
  }

  const found = result?.spans.filter((s): s is Entity => typeof s === 'object') ?? []

  return (
    <div className="flex flex-col gap-4">
      <DemoForm id="entities-input" label="Thai text" value={text} onChange={setText} examples={EXAMPLES}
        onExample={(ex) => { setText(ex); analyse(ex) }} onSubmit={() => analyse(text)} busy={busy} max={200} action="Find entities" />
      <ModelStatus status={status} progress={progress} error={error} size={downloadBytes('tokenizer') + downloadBytes('ner')} />
      {result && (
        <div className="flex flex-col gap-4 border-t border-rule pt-4" aria-live="polite">
          <output lang="th" className="font-display text-2xl leading-[2.1]">
            {result.spans.map((s, i) =>
              typeof s === 'string' ? <span key={i}>{s}</span> : (
                <span key={i} className="border-b-2 border-blue pb-px mx-0.5" title={ENTITY_TYPES[s.type] ?? s.type}>
                  {s.text}<sup className="font-mono text-[11px] ml-0.5 text-blue">{s.type}</sup>
                </span>
              ),
            )}
          </output>
          <p className="text-sm text-mute">
            {found.length === 0 ? 'No entities found.' : found.map((e) => `${e.text}: ${ENTITY_TYPES[e.type] ?? e.type}`).join(' · ')}
          </p>
          <details>
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.08em] text-mute hover:text-ink">What the model saw: one tag per word</summary>
            <div className="overflow-x-auto mt-3">
              <table className="border-collapse">
                <tbody>
                  <tr>
                    <th scope="row" className="pr-3 text-left font-mono text-[11px] font-normal text-mute">word</th>
                    {result.words.map((w, i) => <td key={i} lang="th" className="px-2 text-center font-display text-lg whitespace-nowrap">{w}</td>)}
                  </tr>
                  <tr>
                    <th scope="row" className="pr-3 text-left font-mono text-[11px] font-normal text-mute">tag</th>
                    {result.tags.map((t, i) => <td key={i} className={`px-2 text-center font-mono text-[11px] whitespace-nowrap ${/_(B|I)$/.test(t) ? 'text-blue' : 'text-mute'}`}>{t}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-mute mt-2">_B marks the first word of an entity and _I a word that continues it. O means outside any entity.</p>
          </details>
        </div>
      )}
    </div>
  )
}
