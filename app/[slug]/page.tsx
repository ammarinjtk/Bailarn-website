import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TASKS } from '@/lib/tasks'
import { PAPER } from '@/lib/paper'
import Architecture from '@/components/architecture'
import { CONTENT } from '@/content'

export const dynamicParams = false

export function generateStaticParams() {
  return TASKS.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const task = TASKS.find((t) => t.slug === slug)
  return { title: task?.title, description: task?.blurb }
}

const SECTIONS = [
  ['try', 'Try it'],
  ['task', 'The task'],
  ['io', 'Input → output'],
  ['architecture', 'Architecture'],
  ['data', 'Data & results'],
  ['limits', 'Limits'],
  ['cite', 'Cite'],
] as const

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 grid md:grid-cols-[12rem_1fr] gap-x-10 gap-y-3 border-t border-rule pt-6">
      <h2 id={`${id}-title`} className="font-mono text-xs uppercase tracking-[0.1em] text-green pt-1">{title}</h2>
      <div className="flex flex-col gap-4 max-w-[68ch] min-w-0">{children}</div>
    </section>
  )
}

export default async function TaskPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = TASKS.findIndex((t) => t.slug === slug)
  const task = TASKS[index]
  if (!task) notFound()
  const content = CONTENT[task.slug]
  const next = TASKS[(index + 1) % TASKS.length]

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 flex flex-col gap-8">
      <header className="flex flex-col gap-3 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-green">{task.level} · task {index + 1} of {TASKS.length}</p>
        <h1 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-3xl sm:text-4xl font-semibold">{task.title}</span>
          <span className="font-display text-2xl text-mute" lang="th">{task.thai}</span>
        </h1>
        <p className="text-lg text-mute">{task.blurb}</p>
        <ul className="flex flex-wrap gap-2 font-mono text-xs">
          <li className={`px-2 py-0.5 border rounded-sm ${task.score ? 'border-leaf text-green' : 'border-rule text-mute'}`}>{task.score ? `${task.score} · BEST2010_I2R test` : 'No published test score'}</li>
          <li className="px-2 py-0.5 border border-rule rounded-sm text-mute">{task.model}</li>
        </ul>
      </header>

      {content ? (
        <>
          <nav aria-label="On this page" className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[13px] text-mute border-y border-rule py-2.5">
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`} className="hover:text-ink">{label}</a>)}
          </nav>
          <section id="try" aria-label="Try it" className="scroll-mt-6 border border-rule rounded-sm bg-sheet p-4 sm:p-6"><content.Demo /></section>
          <Section id="task" title="The task">{content.task}</Section>
          <Section id="io" title="Input → output">{content.io}</Section>
          <Section id="architecture" title="Architecture">
            {content.architecture.map((a) => (
              <div key={a.model} className="flex flex-col gap-3">{a.intro}<Architecture model={a.model} /></div>
            ))}
            <p className="text-sm text-mute">Generated from the model file this page downloads. Shapes leave out the batch size.</p>
          </Section>
          <Section id="data" title="Data & results">{content.data}</Section>
          <Section id="limits" title="Limits"><ul className="list-disc pl-5 flex flex-col gap-2">{content.limits.map((l, i) => <li key={i}>{l}</li>)}</ul></Section>
          <Section id="cite" title="Cite">
            <p>{PAPER.authors.join(', ')}. &ldquo;{PAPER.title}.&rdquo; <i>{PAPER.venue}</i>, {PAPER.year}.</p>
            <a href={PAPER.url} className="text-green underline underline-offset-4 decoration-leaf self-start">Read the paper on IEEE Xplore</a>
          </Section>
          <Link href={`/${next.slug}/`} className="self-end group inline-flex items-baseline gap-2 border-t border-rule pt-4 hover:text-green">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Next</span>
            <span className="font-medium">{next.title}</span>
            <span aria-hidden="true" className="text-green group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </>
      ) : (
        <section className="border border-dashed border-rule rounded-sm bg-sheet p-8 text-mute">This demo is being rebuilt.</section>
      )}
    </div>
  )
}
