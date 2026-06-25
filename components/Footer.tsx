'use client';

import { useLang } from '@/context/LanguageContext';

const INSTAGRAM = 'https://www.instagram.com/the_barber_kingg/';
const FACEBOOK = 'https://www.facebook.com/The-Barber-KING-109207757505223';
const GMAPS = 'https://maps.google.com/?q=The+Barber+King+Varna';
const ORVEXIS = 'https://orvexisiv.com';
const PHONE = '0896175008';
const PHONE_DISPLAY = '089 617 5008';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function MapsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-bk-black border-t border-bk-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-8 barber-pole rounded-full opacity-80" />
              <span className="font-display text-bk-cream text-base tracking-[0.15em]">THE BARBER KING</span>
            </div>
            <p className="font-accent italic text-bk-muted text-base">{t.footer.tagline}</p>
            <a href={`tel:${PHONE}`} className="font-body text-bk-muted text-sm hover:text-bk-gold transition-colors duration-300">
              {PHONE_DISPLAY}
            </a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-bk-gold">Social</p>
            <div className="flex flex-col gap-3">
              {[
                { href: INSTAGRAM, icon: <InstagramIcon />, label: t.footer.social_instagram },
                { href: FACEBOOK, icon: <FacebookIcon />, label: t.footer.social_facebook },
                { href: GMAPS, icon: <MapsIcon />, label: t.footer.social_google },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-bk-muted hover:text-bk-gold transition-colors duration-300 group"
                >
                  <span className="text-bk-gold-dim group-hover:text-bk-gold transition-colors duration-300">
                    {s.icon}
                  </span>
                  <span className="font-body text-sm">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-bk-gold">Quick links</p>
            <div className="flex flex-col gap-2">
              {['#about', '#services', '#barbers', '#gallery', '#reviews', '#booking', '#location'].map((href) => (
                <a key={href} href={href} className="font-body text-bk-muted text-sm hover:text-bk-cream transition-colors duration-300 capitalize">
                  {href.replace('#', '')}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-rule mb-8" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-body text-bk-border text-xs leading-relaxed max-w-lg">
            {t.footer.gdpr}
          </p>
          <p className="font-body text-bk-border text-xs shrink-0">
            {t.footer.credit}{' '}
            <a
              href={ORVEXIS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bk-muted hover:text-bk-gold transition-colors duration-300"
            >
              {t.footer.credit_link}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
