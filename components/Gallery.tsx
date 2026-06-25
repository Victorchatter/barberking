'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';

const SLOTS = [
  { src: '/images/gallery/g01.jpg', alt: 'Отборна снимка пред THE BARBER KING' },
  { src: '/images/gallery/g02.jpg', alt: 'Витрина на THE BARBER KING, Варна' },
  { src: '/images/gallery/g03.jpg', alt: 'Интериор при откриването' },
  { src: '/images/gallery/g04.jpg', alt: 'Бръснарите на THE BARBER KING' },
  { src: '/images/gallery/g05.jpg', alt: 'Салонът — черни кресла и мраморни стени' },
  { src: '/images/gallery/g06.jpg', alt: 'Екипът в действие' },
  { src: '/images/gallery/g07.jpg', alt: 'Портрет на бръснар' },
  { src: '/images/gallery/g08.jpg', alt: 'Прецизно подстригване' },
  { src: '/images/gallery/g09.jpg', alt: 'Фасада на THE BARBER KING' },
];

export default function Gallery() {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els?.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.06 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i !== null ? (i - 1 + SLOTS.length) % SLOTS.length : null)), []);
  const next = useCallback(() => setLightbox((i) => (i !== null ? (i + 1) % SLOTS.length : null)), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, prev, next]);

  return (
    <>
      <section id="gallery" ref={sectionRef} className="py-24 lg:py-32 bg-bk-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="gold-rule mb-16 reveal" />

          <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
            {t.gallery.section_label}
          </p>
          <h2
            className="font-display font-black text-bk-cream leading-none mb-16 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            {t.gallery.title}
          </h2>

          {/* Masonry grid */}
          <div className="columns-2 lg:columns-3 gap-px space-y-px reveal reveal-delay-2">
            {SLOTS.map((slot, i) => (
              <div
                key={i}
                className="relative break-inside-avoid overflow-hidden cursor-pointer group bg-bk-raised"
                style={{ aspectRatio: i % 3 === 1 ? '3/4' : '4/3' }}
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  fill
                  className="object-cover photo-grade group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bk-gold/0 group-hover:bg-bk-gold/10 transition-colors duration-300" />
                <div className="absolute inset-0 border border-transparent group-hover:border-bk-gold transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-bk-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-bk-muted hover:text-bk-cream transition-colors p-2"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 text-bk-muted hover:text-bk-gold transition-colors p-4"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div
            className="relative w-full max-w-4xl mx-16 aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={SLOTS[lightbox].src}
              alt={SLOTS[lightbox].alt}
              fill
              className="object-contain photo-grade"
              sizes="90vw"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 text-bk-muted hover:text-bk-gold transition-colors p-4"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div className="absolute bottom-6 text-bk-muted text-xs font-body tracking-wider">
            {lightbox + 1} / {SLOTS.length}
          </div>
        </div>
      )}
    </>
  );
}
