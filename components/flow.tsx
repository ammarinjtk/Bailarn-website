// Input → output as a row of steps.
export default function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <li key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-mute">→</span>}
          <span className="px-2.5 py-1.5 bg-paper border border-rule rounded-sm">{s}</span>
        </li>
      ))}
    </ol>
  )
}
