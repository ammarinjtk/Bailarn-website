import './globals.css'

import type { Metadata } from 'next'
import { Noto_Serif_Thai, Sarabun, DM_Mono } from 'next/font/google'
import Nav from '@/components/nav'
import Footer from '@/components/footer'

const serifThai = Noto_Serif_Thai({ subsets: ['thai', 'latin'], weight: ['500', '700'], variable: '--font-serif-thai', display: 'swap' })
const sarabun = Sarabun({ subsets: ['thai', 'latin'], weight: ['400', '500', '600'], variable: '--font-sarabun', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://bailarn.ammarinjtk.com'),
  title: { template: '%s · Bailarn', default: 'Bailarn · Thai NLP in your browser' },
  description: 'Thai word segmentation, named entities, word similarity, part-of-speech tags, sentiment and topic labels. The models run in your browser.',
}

// The old site used hash routes (#/tokenizer); send those links to the new pages.
const legacyRedirect = `try{var m={'#/tokenizer':'/tokenize/','#/ner':'/entities/','#/word-embedder':'/embeddings/','#/home':'/'};var h=location.hash.split('?')[0];if(m[h])location.replace(m[h])}catch(e){}`

// Sets data-theme before first paint so a dark-mode visitor never sees a light flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serifThai.variable} ${sarabun.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: legacyRedirect + themeScript }} />
      </head>
      <body className="font-sans antialiased min-h-dvh flex flex-col">
        <Nav />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
