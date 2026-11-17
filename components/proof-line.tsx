// A Thai sentence set as a proof, with a green word-break mark between each word.
export default function ProofLine({ words, animate = false, className = '' }: { words: string[]; animate?: boolean; className?: string }) {
  return (
    <span lang="th" className={className}>
      {/* Each word carries the mark after it, so a line can end on a mark but never start with one. */}
      {words.map((w, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {w}
          {i < words.length - 1 && <span aria-hidden="true" className={`cut ${animate ? 'cut-drop' : ''}`} style={animate ? { animationDelay: `${300 + i * 140}ms` } : undefined} />}
        </span>
      ))}
    </span>
  )
}
