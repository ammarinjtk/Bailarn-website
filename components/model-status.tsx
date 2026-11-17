import type { Progress } from '@/lib/nlp/runtime.ts'
import type { Status } from '@/lib/nlp/use-model.ts'

const mb = (n: number) => (n / 1e6).toFixed(1)

/** Download bar while a model loads, then a short "working" line while it runs. */
export default function ModelStatus({ status, progress, error, size }: { status: Status; progress: Progress | null; error: string | null; size: number }) {
  if (status === 'error') return <p role="alert" className="text-sm text-danger">{error}</p>
  if (status === 'downloading') {
    const loaded = progress?.loaded ?? 0
    const total = progress?.total ?? size
    return (
      <div role="status" className="flex flex-col gap-1.5">
        <div className="flex justify-between font-mono text-xs text-mute tabular-nums">
          <span>Downloading the model</span>
          <span>{mb(loaded)} / {mb(total)} MB</span>
        </div>
        <div className="h-1.5 bg-rule overflow-hidden rounded-full">
          <div className="h-full bg-leaf transition-[width] duration-200" style={{ width: `${Math.max(2, (100 * loaded) / total)}%` }} />
        </div>
        <span className="text-xs text-mute">Downloaded once, then it runs on your device.</span>
      </div>
    )
  }
  if (status === 'running') return <p role="status" className="font-mono text-xs text-mute">Running the model…</p>
  if (status === 'idle') return <p className="font-mono text-xs text-mute">The first run downloads {mb(size)} MB.</p>
  return null
}
