'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';

const PHONE = '0896175008';
const WHATSAPP = '359896175008';

export default function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      (el.querySelector('.hero-bg') as HTMLElement | null)?.style.setProperty(
        'transform', `translateY(${y * 0.3}px)`
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0 scale-110">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="The Barber King interior"
          fill
          priority
          className="object-cover photo-grade"
          sizes="100vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-bk-black via-bk-black/60 to-bk-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-bk-black/50 via-transparent to-transparent" />
      </div>

      {/* Barber pole accent — left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 barber-pole opacity-40 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pb-20 lg:pb-28">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 text-bk-muted text-xs tracking-[0.2em] uppercase font-body"
          style={{ animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
        >
          <span className="w-6 h-px bg-bk-gold-dim" />
          {t.hero.badge}
          <span className="w-6 h-px bg-bk-gold-dim" />
        </div>

        {/* Main headline */}
        <h1
          className="font-display font-black leading-none tracking-tight text-bk-cream mb-6"
          style={{
            fontSize: 'clamp(5rem, 18vw, 15rem)',
            lineHeight: 0.9,
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}
        >
          <span className="block">{t.hero.headline_1}</span>
          <span className="block text-bk-gold">{t.hero.headline_2}</span>
          <span className="block">{t.hero.headline_3}</span>
        </h1>

        {/* Tagline */}
        <p
          className="font-accent italic text-bk-muted mb-3"
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
            animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both',
          }}
        >
          {t.hero.tagline}
        </p>
        <p
          className="font-body text-bk-muted text-sm tracking-[0.15em] uppercase mb-12"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both' }}
        >
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both' }}
        >
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-all duration-300 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t.hero.cta_primary}
          </a>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-bk-border text-bk-cream font-display text-sm tracking-widest uppercase hover:border-bk-gold hover:text-bk-gold transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            {t.hero.cta_secondary}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-bk-muted"
        style={{ animation: 'fadeIn 1s 1.2s both' }}
      >
        <span className="text-xs tracking-[0.25em] uppercase font-body [writing-mode:vertical-rl]">scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent to-bk-gold" />
      </div>
    </section>
  );
}
