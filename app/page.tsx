import Link from 'next/link'
import Image from 'next/image'
import ProofLine from '@/components/proof-line'
import { TASKS, type Level } from '@/lib/tasks'
import { PAPER } from '@/lib/paper'
import Reader from '@/public/illustrations/search.webp'

// Example per demo. Outputs shown are the models' real results; embeddings and topics show their input only.
const EXAMPLES: Record<string, React.ReactNode> = {
  tokenize: <ProofLine words={['นายก', 'รัฐมนตรี', 'เดินทาง', 'ไป', 'เชียงใหม่']} />,
  entities: (
    <span lang="th">
      สถานที่ที่<Entity tag="TTL">คุณ</Entity><Entity tag="PER">สมชาย</Entity>ชอบไปคือ<Entity tag="ORG">เกาหลีใต้</Entity>
    </span>
  ),
  embeddings: <span lang="th">แม่ · พ่อ · เพื่อนบ้าน</span>,
  pos: (
    <span lang="th" className="inline-flex flex-wrap gap-x-2 gap-y-1">
      {[['เรา', 'PPER'], ['จะ', 'AUX'], ['ไป', 'VV'], ['เดิน', 'VV'], ['เล่น', 'VV'], ['ที่', 'P'], ['หนองคาย', 'NR']].map(([w, t]) => (
        <span key={w + t} className="inline-flex flex-col items-center leading-tight">{w}<span className="font-mono text-[10px] text-blue">{t}</span></span>
      ))}
    </span>
  ),
  sentiment: <span lang="th">อาหารอร่อย บริการดี จะกลับมาอีก <span className="font-sans text-base text-green whitespace-nowrap">→ positive</span></span>,
  topics: <span lang="th">Asus Zenfone กับ Huawei nova อันไหนดีกว่ากัน</span>,
}

const LEVELS: { level: Level; question: string }[] = [
  { level: 'Lexical', question: 'Where does each word end?' },
  { level: 'Syntactic', question: 'What role does each word play?' },
  { level: 'Semantic', question: 'What do the words and the text mean?' },
]

function Entity({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <span className="border-b-2 border-blue pb-px mx-0.5">
      {children}<sup className="font-mono text-[10px] ml-0.5 text-blue">{tag}</sup>
    </span>
  )
}

const linkClass = 'text-green underline underline-offset-4 decoration-leaf'

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-mute">Thai NLP research · runs in your browser</p>
          <h1 className="font-display font-medium text-[clamp(2rem,5.2vw,3.4rem)] leading-[1.45]">
            <ProofLine words={['สวัสดี', 'ตอน', 'เช้า', 'เป็น', 'ยัง', 'ไง', 'บ้าง', 'ครับ']} animate />
          </h1>
          <p className="text-lg text-mute max-w-[52ch]">
            Thai runs words together without spaces. Bailarn finds where each word ends, tags names and word classes,
            and reads the tone of a review. Every model downloads once and runs on your device, so what you type is never sent anywhere.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/tokenize/" className="inline-flex items-center h-11 px-5 rounded-sm bg-ink text-paper font-medium hover:bg-green transition-colors">Try word segmentation</Link>
            <a href="#research" className="inline-flex items-center h-11 px-5 rounded-sm border border-rule hover:border-ink transition-colors">About the research</a>
          </div>
        </div>
        <Image src={Reader} alt="" priority className="art w-full max-w-[190px] sm:max-w-[240px] md:max-w-[300px] h-auto justify-self-center order-first md:order-none" sizes="(min-width: 768px) 300px, 240px" />
      </section>

      <section aria-labelledby="demos" className="border-t border-rule bg-sheet">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-10">
          <h2 id="demos" className="font-mono text-xs uppercase tracking-[0.12em] text-mute">Six demos, by linguistic level</h2>
          {LEVELS.map(({ level, question }) => (
            <div key={level} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t-[3px] border-leaf pt-3">
                <h3 className="font-mono text-sm uppercase tracking-[0.08em] text-green">{level}</h3>
                <p className="text-mute">{question}</p>
              </div>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TASKS.filter((t) => t.level === level).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}/`} className="group h-full flex flex-col gap-3 p-5 border border-rule rounded-sm bg-paper hover:border-ink transition-colors">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-semibold text-lg">{t.title}</h4>
                        <span className="font-display text-mute" lang="th">{t.thai}</span>
                      </div>
                      <p className="font-display text-xl leading-[1.9] min-h-[3.8em]">{EXAMPLES[t.slug]}</p>
                      <p className="text-sm text-mute grow">{t.blurb}</p>
                      <div className="flex items-center justify-between font-mono text-xs text-mute pt-1">
                        <span>{t.model}</span>
                        <span aria-hidden="true" className="text-green group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="research" aria-labelledby="research-title" className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 grid md:grid-cols-[1.5fr_1fr] gap-10 scroll-mt-6">
        <div className="flex flex-col gap-4">
          <h2 id="research-title" className="text-2xl font-semibold">The research</h2>
          <p className="max-w-[62ch]">
            Bailarn was a bachelor&apos;s senior project in Computer Engineering at Chulalongkorn University, 2017–2018. Deep learning
            already worked well for English, while Thai, a low-resource language, had few tools and little shared data.
          </p>
          <p className="max-w-[62ch]">
            The study compared several deep learning designs on the basic Thai tasks, using BEST2010_I2R, NECTEC&apos;s annotated
            corpus, and tested how they hold up on noisy text. The best model for each task became part of the Bailarn Python
            library, and the same models run on this site.
          </p>
          <figure className="border-l-[3px] border-leaf pl-4 flex flex-col gap-1 mt-2">
            <blockquote className="font-medium">{PAPER.title}</blockquote>
            <figcaption className="text-sm text-mute">
              {PAPER.authors.join(', ')}. <i>{PAPER.venue}</i>, {PAPER.year}.{' '}
              <a href={PAPER.url} className={linkClass}>IEEE Xplore</a>
            </figcaption>
          </figure>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start text-sm">
          <div><dt className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Institution</dt><dd className="mt-1">Chulalongkorn University</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Data</dt><dd className="mt-1">BEST2010_I2R, NECTEC</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Years</dt><dd className="mt-1">2017–2018</dd></div>
          <div><dt className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Framework</dt><dd className="mt-1">Keras, served with TensorFlow.js</dd></div>
          <div className="col-span-2">
            <dt className="font-mono text-xs uppercase tracking-[0.08em] text-mute">Code</dt>
            <dd className="mt-1 flex gap-4">
              <a className={linkClass} href="https://github.com/ammarinjtk/Bailarn-python-library">Python library</a>
              <a className={linkClass} href="https://github.com/ammarinjtk/Bailarn-website">This site</a>
            </dd>
          </div>
        </dl>
      </section>
    </>
  )
}
