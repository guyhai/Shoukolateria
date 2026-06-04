import type { Metadata } from 'next'
import { Playfair_Display, Assistant } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'השוקולדיה | סדנאות פרלינים וקוקטיילים – השוק 34, תל אביב',
  description:
    'סדנאות שוקולד ייחודיות עם רומי – פרלינים וקוקטיילים, בבית, ליד שוק לווינסקי. מתאים לקבוצות, זוגות וארועים. ⭐ 5.0 Google',
  openGraph: {
    title: 'השוקולדיה | סדנאות פרלינים וקוקטיילים',
    description: 'סדנאות שוקולד עם רומי – פרלינים וקוקטיילים, השוק 34 תל אביב.',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${playfair.variable} ${assistant.variable} font-assistant antialiased`}>
        {children}
      </body>
    </html>
  )
}
