'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';

const PHONE = '0896175008';
const PHONE_DISPLAY = '089 617 5008';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about', label: t.nav.about },
    { href: '#services', label: t.nav.services },
    { href: '#barbers', label: t.nav.barbers },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#reviews', label: t.nav.reviews },
    { href: '#location', label: t.nav.location },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-bk-black/95 backdrop-blur-md border-b border-bk-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-1 h-8 barber-pole rounded-full opacity-80" />
            <span className="font-display text-lg tracking-[0.15em] text-bk-cream group-hover:text-bk-gold transition-colors duration-300">
              THE BARBER KING
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="gold-link text-xs tracking-[0.12em] uppercase text-bk-muted hover:text-bk-cream transition-colors duration-300 font-body"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`tel:${PHONE}`}
              className="text-xs tracking-widest text-bk-muted hover:text-bk-gold transition-colors duration-300 font-body"
            >
              {PHONE_DISPLAY}
            </a>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'bg' ? 'en' : 'bg')}
              className="text-xs tracking-widest font-body text-bk-muted hover:text-bk-cream transition-colors duration-300 border border-bk-border px-3 py-1.5 hover:border-bk-gold"
              aria-label="Toggle language"
            >
              {lang === 'bg' ? 'EN' : 'БГ'}
            </button>

            <a
              href="#booking"
              className="px-5 py-2.5 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300"
            >
              {t.nav.book}
            </a>
          </div>

          {/* Mobile row */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setLang(lang === 'bg' ? 'en' : 'bg')}
              className="text-xs tracking-widest font-body text-bk-muted border border-bk-border px-2.5 py-1 hover:border-bk-gold"
            >
              {lang === 'bg' ? 'EN' : 'БГ'}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-bk-cream"
              aria-label="Toggle menu"
            >
              <div className="w-6 space-y-1.5">
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-screen border-b border-bk-border' : 'max-h-0'
        }`}
      >
        <div className="bg-bk-black/98 backdrop-blur-md px-6 pb-8 pt-4 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-[0.12em] uppercase text-bk-muted hover:text-bk-cream transition-colors duration-300 font-body"
            >
              {l.label}
            </a>
          ))}
          <div className="gold-rule" />
          <a href={`tel:${PHONE}`} className="text-sm tracking-widest text-bk-muted font-body">
            {PHONE_DISPLAY}
          </a>
          <a
            href="#booking"
            onClick={() => setMenuOpen(false)}
            className="inline-block px-6 py-3 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase text-center"
          >
            {t.nav.book}
          </a>
        </div>
      </div>
    </nav>
  );
}
