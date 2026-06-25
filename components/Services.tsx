'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LanguageContext';

const ICONS: Record<string, React.ReactNode> = {
  scissors: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
    </svg>
  ),
  razor: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="8" width="16" height="8" rx="1"/><path d="M4 12h16M8 8V6a2 2 0 014 0v2M12 8V6"/>
    </svg>
  ),
  combo: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
    </svg>
  ),
  shapeup: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  eyebrow: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8c2-4 8-6 14-2M6 12c2-3 7-4 11-1"/>
    </svg>
  ),
  shave: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 4l10 0M7 4L4 20M17 4l3 16M4 20h16M8 12h8"/>
    </svg>
  ),
  color: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L8 12l4 4 4-4L12 2zM8 12H4M16 12h4M12 16v6"/>
    </svg>
  ),
  wash: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 20h10M5 16c0 2.21 3.13 4 7 4s7-1.79 7-4V8c0-2.21-3.13-4-7-4S5 5.79 5 8v8z"/>
      <path d="M5 10c0 2.21 3.13 4 7 4s7-1.79 7-4"/>
    </svg>
  ),
  kids: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/><path d="M8 14c-4 1-6 4-6 6h20c0-2-2-5-6-6"/>
    </svg>
  ),
};

export default function Services() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els?.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 lg:py-32 bg-bk-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16 reveal" />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
              {t.services.section_label}
            </p>
            <h2
              className="font-display font-black text-bk-cream leading-none reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              {t.services.title}
            </h2>
          </div>
          <p className="font-accent italic text-bk-muted text-lg lg:text-xl max-w-xs reveal reveal-delay-2">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-bk-border reveal reveal-delay-2">
          {t.services.items.map((svc) => (
            <div
              key={svc.id}
              className="bg-bk-black p-8 flex flex-col gap-5 group hover:bg-bk-raised transition-all duration-300 border border-transparent hover:border-bk-gold-dim cursor-default"
            >
              <div className="text-bk-gold-dim group-hover:text-bk-gold transition-colors duration-300">
                {ICONS[svc.icon]}
              </div>
              <h3 className="font-display font-bold text-bk-cream text-xl tracking-wide group-hover:text-bk-gold transition-colors duration-300">
                {svc.name}
              </h3>
              <p className="font-body text-bk-muted text-sm leading-relaxed flex-1">
                {svc.desc}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-bk-border">
                <span className="font-display text-bk-gold-dim text-sm tracking-wider">
                  {t.services.price_tbd}
                </span>
                <a
                  href={`#booking?service=${svc.id}`}
                  className="text-xs tracking-[0.12em] uppercase text-bk-muted hover:text-bk-gold transition-colors duration-300 font-body"
                >
                  →
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-body text-xs text-bk-muted tracking-wider reveal">
          {t.services.note}
        </p>
      </div>
    </section>
  );
}
