import { describeModel } from '@/lib/architecture'

/** Layer-by-layer diagram generated from the model's own topology at build time. */
export default function Architecture({ model }: { model: string }) {
  const { input, layers } = describeModel(model)
  return (
    <ol className="flex flex-col gap-1.5 max-w-2xl">
      <li className="grid grid-cols-[1fr_auto] gap-3 items-baseline px-3 py-2 border border-dashed border-rule rounded-sm">
        <span>Input ids</span>
        <code className="font-mono text-xs text-mute tabular-nums">{input}</code>
      </li>
      {layers.map((l, i) => (
        <li key={i} className={`grid grid-cols-[1fr_auto] gap-x-3 items-baseline px-3 py-2 bg-paper border border-rule border-l-4 border-l-leaf rounded-sm ${l.branch ? 'ml-6' : ''}`}>
          <span>
            {l.branch && <span className="font-mono text-[11px] text-green mr-2">branch {l.branch}</span>}
            {l.label}
          </span>
          <code className="font-mono text-xs text-mute tabular-nums">{l.shape}</code>
          {l.note && <span className="col-span-2 font-mono text-[11px] text-mute">{l.note}</span>}
        </li>
      ))}
    </ol>
  )
}
