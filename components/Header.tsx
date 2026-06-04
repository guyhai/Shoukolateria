'use client'

import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'על השוקולטריה', href: '#about' },
  { label: 'הסדנאות', href: '#workshops' },
  { label: 'גלריה', href: '#gallery' },
  { label: 'הרשמה', href: '#booking' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-choco-900 shadow-lg shadow-black/30'
          : 'bg-gradient-to-b from-choco-950/80 to-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col items-center leading-none group">
          <span className="font-playfair text-choco-400 text-2xl md:text-3xl tracking-wide group-hover:text-choco-300 transition-colors">
            השוקולדיה
          </span>
          <span className="font-assistant text-choco-200 text-xs tracking-[0.25em] uppercase">
            Ha-Shukoldaya
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-assistant text-sm font-semibold text-choco-200 hover:text-choco-400
                         tracking-wider transition-colors duration-200 uppercase"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className="btn-primary text-sm py-2 px-6"
          >
            הרשמי עכשיו
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-choco-200 hover:text-choco-400 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="תפריט"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-choco-900 border-t border-choco-700 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-assistant text-choco-200 hover:text-choco-400 font-semibold tracking-wider uppercase text-sm py-1"
            >
              {l.label}
            </a>
          ))}
          <a href="#booking" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm py-2">
            הרשמי עכשיו
          </a>
        </div>
      )}
    </header>
  )
}
