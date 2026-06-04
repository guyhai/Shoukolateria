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
  title: 'שוקולדריה | סדנאות שוקולד ליד שוק לווינסקי',
  description:
    'סדנאות שוקולד אומנותיות בלב תל אביב, ליד שוק לווינסקי. טראפלס, בונבונים, טבליות שוקולד — חוויה בלתי נשכחת בקבוצות קטנות.',
  openGraph: {
    title: 'שוקולדריה | סדנאות שוקולד',
    description: 'סדנאות שוקולד אומנותיות בלב תל אביב, ליד שוק לווינסקי.',
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
