'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';

export default function Barbers() {
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
    <section id="barbers" ref={sectionRef} className="py-24 lg:py-32 bg-bk-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16 reveal" />

        <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
          {t.barbers.section_label}
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
          <h2
            className="font-display font-black text-bk-cream leading-none reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            {t.barbers.title}
          </h2>
          <p className="font-accent italic text-bk-muted text-lg max-w-xs reveal reveal-delay-2">
            {t.barbers.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-bk-border reveal reveal-delay-2">
          {t.barbers.items.map((barber, i) => (
            <div key={barber.id} className="bg-bk-surface group relative overflow-hidden">
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden bg-bk-raised">
                <Image
                  src={`/images/barbers/${barber.id}.jpg`}
                  alt={barber.name}
                  fill
                  className="object-cover photo-grade group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Placeholder overlay when no real photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-bk-raised">
                  <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-bk-border mb-3" stroke="currentColor">
                    <circle cx="12" cy="8" r="4"/><path d="M8 14c-4 1-6 4-6 6h20c0-2-2-5-6-6"/>
                  </svg>
                  <span className="text-bk-border text-xs font-body tracking-wider">{barber.name}</span>
                </div>
                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bk-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-bold text-bk-cream text-2xl group-hover:text-bk-gold transition-colors duration-300">
                    {barber.name}
                  </h3>
                  <span className="text-bk-gold font-display font-bold text-lg">0{i + 1}</span>
                </div>
                <p className="font-body text-bk-gold text-xs tracking-[0.12em] uppercase mb-3">
                  {barber.specialty}
                </p>
                <p className="font-body text-bk-muted text-sm leading-relaxed mb-6">
                  {barber.desc}
                </p>
                <a
                  href={`#booking?barber=${barber.id}`}
                  className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-body text-bk-muted hover:text-bk-gold transition-colors duration-300 group/btn"
                >
                  {t.barbers.book_with} {barber.name}
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
