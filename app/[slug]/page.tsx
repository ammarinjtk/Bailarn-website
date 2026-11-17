import { notFound } from 'next/navigation'
import { TASKS } from '@/lib/tasks'

export const dynamicParams = false

export function generateStaticParams() {
  return TASKS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const task = TASKS.find((t) => t.slug === slug)
  return { title: task?.title }
}

export default async function TaskPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const task = TASKS.find((t) => t.slug === slug)
  if (!task) notFound()
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 flex flex-col gap-8">
      <header className="flex flex-col gap-3 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-mute">{task.model}</p>
        <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-3xl sm:text-4xl font-semibold">{task.title}</span>
          <span className="font-display text-2xl text-mute" lang="th">{task.thai}</span>
        </h1>
        <p className="text-lg text-mute">{task.blurb}</p>
        <p className="font-mono text-xs text-mute">
          {task.score ? <>BEST2010 test set: {task.score}</> : <>No published test score</>}
        </p>
      </header>
      {/* The demo itself is built in the next step. */}
      <section className="border border-dashed border-rule rounded-sm bg-sheet p-8 text-mute">Demo goes here.</section>
    </div>
  )
}
