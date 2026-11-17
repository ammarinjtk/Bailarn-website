import Link from 'next/link'
import Image from 'next/image'
import ProofLine from '@/components/proof-line'
import { TASKS } from '@/lib/tasks'
import Research from '@/public/illustrations/research.webp'

// Example per demo. Tokenizer and entity outputs are the live models' results; the rest show their input until those demos ship.
const EXAMPLES: Record<string, React.ReactNode> = {
  tokenize: <ProofLine words={['นายก', 'รัฐมนตรี', 'เดินทาง', 'ไป', 'เชียงใหม่']} />,
  entities: (
    <span lang="th">
      สถานที่ที่<Entity tag="TTL">คุณ</Entity><Entity tag="PER">สมชาย</Entity>ชอบไปคือ<Entity tag="ORG" red>เกาหลีใต้</Entity>
    </span>
  ),
  embeddings: <span lang="th">แม่ · พ่อ · เพื่อนบ้าน</span>,
  pos: <span lang="th">เราจะไปเดินเล่นที่หนองคาย</span>,
  sentiment: <span lang="th">อาหารอร่อย บริการดี จะกลับมาอีก</span>,
  topics: <span lang="th">Asus Zenfone กับ Huawei nova อันไหนดีกว่ากัน</span>,
}

function Entity({ tag, red = false, children }: { tag: string; red?: boolean; children: React.ReactNode }) {
  return (
    <span className={`border-b-2 pb-px mx-0.5 ${red ? 'border-red' : 'border-blue'}`}>
      {children}<sup className={`font-mono text-[10px] ml-0.5 ${red ? 'text-red' : 'text-blue'}`}>{tag}</sup>
    </span>
  )
}

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-10 grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-mute">Thai NLP · runs in your browser</p>
          <h1 className="font-display font-medium text-[clamp(2rem,5.2vw,3.4rem)] leading-[1.45]">
            <ProofLine words={['สวัสดี', 'ตอน', 'เช้า', 'เป็น', 'ยัง', 'ไง', 'บ้าง', 'ครับ']} animate />
          </h1>
          <p className="text-lg text-mute max-w-[52ch]">
            Thai runs words together without spaces. Bailarn finds where each word ends, tags names and word classes,
            and reads the tone of a review. Every model downloads once and runs on your device, so what you type is never sent anywhere.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/tokenize/" className="inline-flex items-center h-11 px-5 rounded-sm bg-ink text-paper font-medium hover:bg-red transition-colors">Try word segmentation</Link>
            <a href="https://github.com/ammarinjtk/Bailarn-python-library" className="inline-flex items-center h-11 px-5 rounded-sm border border-rule hover:border-ink transition-colors">Python library</a>
          </div>
        </div>
        <Image src={Research} alt="" priority className="art w-full max-w-[190px] sm:max-w-[260px] md:max-w-[340px] h-auto justify-self-center order-first md:order-none" sizes="(min-width: 768px) 340px, 300px" />
      </section>

      <section aria-labelledby="demos" className="border-t border-rule bg-sheet">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-6">
          <h2 id="demos" className="font-mono text-xs uppercase tracking-[0.12em] text-mute">Six demos</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TASKS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="group h-full flex flex-col gap-3 p-5 border border-rule rounded-sm bg-paper hover:border-ink transition-colors">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-lg">{t.title}</h3>
                    <span className="font-display text-mute" lang="th">{t.thai}</span>
                  </div>
                  <p className="font-display text-xl leading-[1.9] min-h-[3.8em]">{EXAMPLES[t.slug]}</p>
                  <p className="text-sm text-mute grow">{t.blurb}</p>
                  <div className="flex items-center justify-between font-mono text-xs text-mute pt-1">
                    <span>{t.model}</span>
                    <span aria-hidden="true" className="text-red group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
