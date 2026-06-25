'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LanguageContext';

const PHONE = '0896175008';
const PHONE_DISPLAY = '089 617 5008';
const WHATSAPP = '359896175008';
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.1!2d27.9039927!3d43.2100018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a45596faa58247%3A0x2e074837996b4aed!2sThe%20Barber%20King!5e0!3m2!1sbg!2sbg!4v1719000000000';
const MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=The+Barber+King+Varna&destination_place_id=ChIJR4KlqpZVoEAR7UpvmTc4B-I';

const DAYS_BG = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export default function Location() {
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

  const todayIndex = new Date().getDay(); // 0=Sun
  const todayKey = todayIndex === 0 ? 'sun' : DAYS_BG[todayIndex - 1];

  return (
    <section id="location" ref={sectionRef} className="py-24 lg:py-32 bg-bk-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16 reveal" />

        <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4 reveal">
          {t.location.section_label}
        </p>
        <h2
          className="font-display font-black text-bk-cream leading-none mb-16 reveal reveal-delay-1"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
        >
          {t.location.title}
        </h2>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Map */}
          <div className="relative h-80 lg:h-full min-h-80 bg-bk-raised reveal">
            <iframe
              src={MAPS_EMBED}
              className="absolute inset-0 w-full h-full grayscale contrast-125 opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Barber King location"
              aria-label="Map showing The Barber King barbershop location in Varna"
            />
          </div>

          {/* Info */}
          <div className="bg-bk-black p-8 lg:p-12 flex flex-col gap-10 reveal reveal-delay-1">
            {/* Address */}
            <div>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-bk-gold mb-3">Address</p>
              <p className="font-body text-bk-cream text-base leading-relaxed mb-2">{t.location.address}</p>
              <p className="font-accent italic text-bk-muted text-sm">{t.location.landmark}</p>
            </div>

            {/* Hours */}
            <div>
              <p className="font-body text-xs tracking-[0.15em] uppercase text-bk-gold mb-4">{t.location.hours_title}</p>
              <div className="space-y-2">
                {DAYS_BG.map((key) => {
                  const isToday = key === todayKey;
                  const isClosed = key === 'sun';
                  return (
                    <div
                      key={key}
                      className={`flex justify-between items-center py-2 border-b border-bk-border/50 ${isToday ? 'text-bk-gold' : 'text-bk-muted'}`}
                    >
                      <span className={`font-body text-sm ${isToday ? 'font-bold' : ''}`}>
                        {t.location.hours[key]}
                        {isToday && <span className="ml-2 text-xs text-bk-gold-dim">← сега / now</span>}
                      </span>
                      <span className={`font-body text-sm ${isClosed ? 'text-bk-border' : ''}`}>
                        {isClosed ? t.location.hours.closed : t.location.hours.open}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 font-body text-xs text-bk-muted">{t.location.accessibility}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-4 px-6 py-4 border border-bk-border hover:border-bk-gold group transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-bk-gold shrink-0" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
                </svg>
                <span className="font-body text-bk-cream text-sm group-hover:text-bk-gold transition-colors">
                  {t.location.cta_call} — {PHONE_DISPLAY}
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 border border-bk-border hover:border-[#25D366] group transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366] shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="font-body text-bk-cream text-sm group-hover:text-[#25D366] transition-colors">
                  {t.location.cta_whatsapp}
                </span>
              </a>

              <a
                href={MAPS_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 bg-bk-gold hover:bg-bk-gold-light group transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-bk-black shrink-0" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l18-9-9 18-2-8-7-1z"/>
                </svg>
                <span className="font-display font-bold text-bk-black text-sm tracking-widest uppercase">
                  {t.location.cta_navigate}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
