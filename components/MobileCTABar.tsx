'use client';

import { useLang } from '@/context/LanguageContext';

const PHONE = '0896175008';
const WHATSAPP = '359896175008';

export default function MobileCTABar() {
  const { t } = useLang();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-bk-border bg-bk-black/95 backdrop-blur-md">
      <a
        href={`tel:${PHONE}`}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-bk-muted hover:text-bk-gold active:bg-bk-raised transition-colors duration-200"
        aria-label="Call"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
        </svg>
        <span className="font-body text-xs tracking-wider">{t.mobile_cta.call}</span>
      </a>

      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center gap-1 py-3 text-bk-muted hover:text-[#25D366] active:bg-bk-raised transition-colors duration-200"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="font-body text-xs tracking-wider">{t.mobile_cta.whatsapp}</span>
      </a>

      <a
        href="#booking"
        className="flex-1 flex flex-col items-center gap-1 py-3 bg-bk-gold text-bk-black hover:bg-bk-gold-light active:brightness-110 transition-all duration-200"
        aria-label="Book Now"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M8 2v4M16 2v4M3 10h18"/>
        </svg>
        <span className="font-display font-bold text-xs tracking-widest uppercase">{t.mobile_cta.book}</span>
      </a>
    </div>
  );
}
