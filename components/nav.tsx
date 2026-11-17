'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TASKS } from '@/lib/tasks'
import ThemeToggle from './theme-toggle'
import Leaf from '@/public/leaf.png'

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (slug: string) => {
    const on = path?.startsWith(`/${slug}`)
    return `font-mono text-[13px] py-1 border-b-2 transition-colors ${on ? 'text-ink border-stem' : 'text-mute border-transparent hover:text-ink'}`
  }

  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl leading-none whitespace-nowrap" lang="th">
          <Image src={Leaf} alt="" width={28} height={28} priority />
          <span>ใบ<span className="text-green">ลาน</span></span> <span className="font-sans font-medium text-base text-mute">Bailarn</span>
        </Link>
        <nav aria-label="Demos" className="hidden md:flex items-center gap-5">
          {TASKS.map((t) => <Link key={t.slug} href={`/${t.slug}/`} className={linkClass(t.slug)}>{t.nav}</Link>)}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button type="button" className="md:hidden size-9 grid place-items-center rounded-full text-mute hover:text-ink"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>
      <nav id="mobile-nav" aria-label="Demos" hidden={!open} className="md:hidden border-t border-rule bg-sheet">
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {TASKS.map((t) => (
            <li key={t.slug}>
              <Link href={`/${t.slug}/`} className="flex items-baseline justify-between py-3 border-b border-rule">
                <span className="font-medium">{t.title}</span>
                <span className="font-display text-sm text-mute" lang="th">{t.thai}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
