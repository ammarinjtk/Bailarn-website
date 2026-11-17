import { describeModel, type Layer } from '@/lib/architecture'

function Row({ layer, compact = false }: { layer: Layer; compact?: boolean }) {
  return (
    <li className={`grid gap-x-3 items-baseline px-3 py-2 bg-paper border border-rule border-l-4 border-l-leaf rounded-sm ${compact ? 'grid-cols-1' : 'grid-cols-[1fr_auto]'}`}>
      <span>{layer.label}</span>
      <code className="font-mono text-xs text-mute tabular-nums">{layer.shape}</code>
      {layer.note && <span className="col-span-full font-mono text-[11px] text-mute">{layer.note}</span>}
    </li>
  )
}

/** Layer-by-layer diagram generated from the model's own topology at build time. Parallel branches sit side by side. */
export default function Architecture({ model }: { model: string }) {
  const { input, layers } = describeModel(model)

  // Consecutive branch layers form one parallel block: { branch number → its layers in order }.
  const blocks: (Layer | Map<number, Layer[]>)[] = []
  for (const l of layers) {
    const last = blocks[blocks.length - 1]
    if (l.branch === null) blocks.push(l)
    else if (last instanceof Map) last.set(l.branch, [...(last.get(l.branch) ?? []), l])
    else blocks.push(new Map([[l.branch, [l]]]))
  }

  return (
    <ol className="flex flex-col gap-1.5 max-w-3xl">
      <li className="grid grid-cols-[1fr_auto] gap-3 items-baseline px-3 py-2 border border-dashed border-rule rounded-sm">
        <span>Input ids</span>
        <code className="font-mono text-xs text-mute tabular-nums">{input}</code>
      </li>
      {blocks.map((b, i) =>
        b instanceof Map ? (
          <li key={i} className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] p-2 border border-rule rounded-sm">
            {[...b.entries()].map(([n, ls]) => (
              <ol key={n} aria-label={`Branch ${n}`} className="flex flex-col gap-1.5 min-w-0">
                <li className="font-mono text-[11px] text-green px-1">branch {n}</li>
                {ls.map((l, k) => <Row key={k} layer={l} compact />)}
              </ol>
            ))}
          </li>
        ) : (
          <Row key={i} layer={b} />
        ),
      )}
    </ol>
  )
}
