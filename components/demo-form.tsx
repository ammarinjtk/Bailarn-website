'use client'

import Spinner from './spinner'

// The shared input row of every demo: a text field, example buttons, a character count and the run button.
export default function DemoForm({ id, label, value, onChange, examples, onExample, onSubmit, busy, max, action, rows = 2 }: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  examples: string[]
  onExample: (v: string) => void
  onSubmit: () => void
  busy: boolean
  max: number
  action: string
  rows?: number
}) {
  const empty = value.trim().length === 0
  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (!empty) onSubmit() }}>
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.08em] text-mute">{label}</label>
      <textarea id={id} lang="th" rows={rows} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)}
        className="font-display text-xl leading-relaxed bg-paper border border-rule rounded-sm px-3 py-2 focus:border-ink outline-none resize-y" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button key={ex} type="button" lang="th" onClick={() => onExample(ex)} disabled={busy}
              className="font-display text-sm px-2.5 py-1 border border-rule rounded-sm hover:border-ink disabled:opacity-50">{ex}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-mute tabular-nums">{[...value].length} / {max}</span>
          <button type="submit" disabled={busy || empty} aria-busy={busy}
            className="h-10 px-5 inline-flex items-center gap-2 rounded-sm bg-ink text-paper font-medium hover:bg-green disabled:hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 aria-busy:opacity-80">
            {busy && <Spinner />}{busy ? 'Working…' : action}
          </button>
        </div>
      </div>
      {empty && <p className="text-sm text-mute">Type some Thai text first.</p>}
    </form>
  )
}
