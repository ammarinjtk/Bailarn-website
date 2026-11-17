import Link from 'next/link'
import ProofLine from '@/components/proof-line'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 flex flex-col gap-4">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-mute">404</p>
      <h1 className="font-display text-4xl"><ProofLine words={['ไม่', 'พบ', 'หน้า', 'นี้']} /></h1>
      <p className="text-mute">This page does not exist. <Link href="/" className="text-ink underline underline-offset-4 decoration-red">Back to the demos</Link></p>
    </div>
  )
}
