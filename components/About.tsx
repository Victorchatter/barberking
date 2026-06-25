'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LanguageContext';

export default function About() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els?.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const badges = [
    { value: t.about.badges.rating, label: t.about.badges.rating_label },
    { value: t.about.badges.reviews, label: t.about.badges.reviews_label },
    { value: t.about.badges.hours, label: t.about.badges.hours_label },
    { value: t.about.badges.appointment, label: t.about.badges.appointment_label },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 bg-bk-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16 reveal" />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — text */}
          <div>
            <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
              {t.about.section_label}
            </p>
            <h2
              className="font-display font-black text-bk-cream leading-none mb-8 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              {t.about.title}
            </h2>
            <p className="font-body text-bk-muted leading-relaxed text-base lg:text-lg reveal reveal-delay-2">
              {t.about.body}
            </p>
          </div>

          {/* Right — badges grid */}
          <div className="grid grid-cols-2 gap-px bg-bk-border reveal reveal-delay-2">
            {badges.map((b, i) => (
              <div
                key={i}
                className="bg-bk-surface p-8 flex flex-col justify-between"
              >
                <span
                  className="font-display font-black text-bk-gold leading-none block mb-3"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {b.value}
                </span>
                <span className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative barber pole divider */}
        <div className="mt-24 flex items-center gap-6 reveal">
          <div className="flex-1 h-px bg-bk-border" />
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-8 barber-pole opacity-40" />
            ))}
          </div>
          <div className="flex-1 h-px bg-bk-border" />
        </div>
      </div>
    </section>
  );
}
