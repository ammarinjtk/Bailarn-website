import type { Progress } from '@/lib/nlp/runtime.ts'
import type { Status } from '@/lib/nlp/use-model.ts'

const mb = (n: number) => (n / 1e6).toFixed(1)

/** Download progress while a model loads, then an indeterminate bar while it runs. */
export default function ModelStatus({ status, progress, error, size }: { status: Status; progress: Progress | null; error: string | null; size: number }) {
  if (status === 'error') return <p role="alert" className="text-sm text-danger">{error}</p>
  if (status === 'idle') return <p className="font-mono text-xs text-mute">The first run downloads {mb(size)} MB.</p>
  if (status !== 'downloading' && status !== 'running') return null

  const downloading = status === 'downloading'
  const loaded = progress?.loaded ?? 0
  const total = progress?.total ?? size
  const share = Math.min(1, loaded / total)

  return (
    <div role="status" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 font-mono text-xs tabular-nums">
        <span className="text-ink">{downloading ? 'Downloading the model' : 'Running on your device'}</span>
        {downloading && <span className="text-mute">{Math.round(share * 100)}% · {mb(loaded)} / {mb(total)} MB</span>}
      </div>
      <div className="relative h-1.5 rounded-full bg-rule overflow-hidden">
        {downloading ? (
          // scaleX follows every progress event exactly; a width transition lagged behind the numbers.
          <div className="absolute inset-0 origin-left rounded-full bg-leaf overflow-hidden" style={{ transform: `scaleX(${Math.max(0.02, share)})` }}>
            <div className="animate-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          </div>
        ) : (
          <div className="animate-sweep absolute inset-y-0 w-2/5 rounded-full bg-leaf" />
        )}
      </div>
      <span className="text-xs text-mute">{downloading ? 'Downloaded once, then it runs on your device.' : 'Nothing you type leaves your browser.'}</span>
    </div>
  )
}
