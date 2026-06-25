'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LanguageContext';

const GMAPS_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJR4KlqpZVoEAR7UpvmTc4B-I';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className={`w-3 h-3 ${i < count ? 'text-bk-gold' : 'text-bk-border'}`} fill="currentColor">
          <path d="M6 0l1.5 4h4l-3.3 2.4 1.3 4L6 8 2.5 10.4l1.3-4L0 4h4z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els?.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.07 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="reviews" ref={sectionRef} className="py-24 lg:py-32 bg-bk-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16 reveal" />

        <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
          {t.reviews.section_label}
        </p>

        {/* Rating hero */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="reveal reveal-delay-1">
            <h2
              className="font-display font-black text-bk-cream leading-none"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              {t.reviews.title}
            </h2>
          </div>

          <div className="flex items-center gap-6 reveal reveal-delay-2">
            <span
              className="font-display font-black text-bk-gold"
              style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1 }}
            >
              {t.reviews.rating_display}
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 16 16" className="w-5 h-5 text-bk-gold" fill="currentColor">
                    <path d="M8 0l2 6h6L11 10l2 6-5-3.6L3 16l2-6L0 6h6z"/>
                  </svg>
                ))}
              </div>
              <span className="font-body text-bk-muted text-sm tracking-wider">
                {t.reviews.rating_label}
              </span>
              <span className="font-body text-bk-muted text-xs tracking-wider">
                {t.reviews.review_count}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-bk-border reveal reveal-delay-2">
          {t.reviews.items.map((r) => (
            <div
              key={r.id}
              className="bg-bk-surface p-8 flex flex-col gap-4 border-l-2 border-transparent hover:border-bk-gold transition-colors duration-500"
            >
              <Stars count={r.rating} />
              <blockquote className="font-accent italic text-bk-cream text-base leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between pt-4 border-t border-bk-border">
                <div>
                  <p className="font-display font-bold text-bk-cream text-sm">{r.name}</p>
                  <p className="font-body text-bk-muted text-xs tracking-wider mt-0.5">{r.date}</p>
                </div>
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-bk-muted opacity-40" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.7H15c-.3 0-.6.3-.6.6v1.6h3.6L17.5 14H14.4v8.5h-3V14H9.3v-3.1h2.1V8.7c0-2 1.2-3.1 3.1-3.1h3.4v3.1z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center reveal">
          <a
            href={GMAPS_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-bk-border text-bk-muted font-body text-sm tracking-[0.12em] uppercase hover:border-bk-gold hover:text-bk-gold transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.7H15c-.3 0-.6.3-.6.6v1.6h3.6L17.5 14H14.4v8.5h-3V14H9.3v-3.1h2.1V8.7c0-2 1.2-3.1 3.1-3.1h3.4v3.1z"/>
            </svg>
            {t.reviews.leave_review}
          </a>
        </div>
      </div>
    </section>
  );
}
