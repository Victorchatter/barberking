'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLang } from '@/context/LanguageContext';

const PHONE = '359896175008';
const PHONE_RAW = '0896175008';

type Step = 'services' | 'barber' | 'datetime' | 'contact' | 'review' | 'success';

interface BookingState {
  services: string[];
  barber: string | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const STEP_ORDER: Step[] = ['services', 'barber', 'datetime', 'contact', 'review'];

function generateSlots(date: string): string[] {
  // Mon–Sat 09:30–18:00, 30-min intervals; Sunday closed
  if (!date) return [];
  const d = new Date(date);
  if (d.getDay() === 0) return []; // Sunday
  const slots: string[] = [];
  for (let h = 9; h < 18; h++) {
    for (const m of [0, 30]) {
      if (h === 9 && m === 0) continue; // start at 09:30
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

function calendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startPad: first === 0 ? 6 : first - 1, daysInMonth };
}

const STEP_ICON: Record<Step, string> = {
  services: '✂',
  barber: '👤',
  datetime: '📅',
  contact: '📋',
  review: '✓',
  success: '✓',
};

function validateBgPhone(phone: string): boolean {
  return /^(\+359|0)(8[7-9])\d{7}$/.test(phone.replace(/\s/g, ''));
}

function buildICS(state: BookingState, services: string): string {
  if (!state.date || !state.time) return '';
  const start = new Date(`${state.date}T${state.time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    'SUMMARY:The Barber King — Appointment',
    `DESCRIPTION:Services: ${services}`,
    'LOCATION:ul. Doctor Piskyuliev 72\\, Varna 9000',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function BookingWizard() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>('services');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [booking, setBooking] = useState<BookingState>({
    services: [],
    barber: null,
    date: null,
    time: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const stepIndex = STEP_ORDER.indexOf(step);
  const serviceItems = t.services.items;
  const barberItems = t.barbers.items;

  const selectedServiceNames = useMemo(
    () => serviceItems.filter((s) => booking.services.includes(s.id)).map((s) => s.name).join(', '),
    [booking.services, serviceItems]
  );

  const selectedBarberName = useMemo(() => {
    if (!booking.barber) return t.booking.no_preference_label;
    return barberItems.find((b) => b.id === booking.barber)?.name ?? t.booking.no_preference_label;
  }, [booking.barber, barberItems, t.booking.no_preference_label]);

  const toggleService = useCallback((id: string) => {
    setBooking((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  }, []);

  const goTo = useCallback((s: Step) => {
    setStep(s);
  }, []);

  const handleSubmit = useCallback(async () => {
    const errs: Record<string, string> = {};
    if (!booking.name.trim()) errs.name = t.booking.step4.name_error;
    if (!validateBgPhone(booking.phone)) errs.phone = t.booking.step4.phone_error;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, services: selectedServiceNames, barber: selectedBarberName }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setStep('success');
    } catch {
      setErrors({ submit: 'Something went wrong. Please call us directly.' });
    } finally {
      setSubmitting(false);
    }
  }, [booking, t, selectedServiceNames, selectedBarberName]);

  const downloadICS = useCallback(() => {
    const ics = buildICS(booking, selectedServiceNames);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'barberking-appointment.ics';
    a.click();
    URL.revokeObjectURL(url);
  }, [booking, selectedServiceNames]);

  const whatsappMessage = encodeURIComponent(
    `Здравейте! Запазих час:\nУслуги: ${selectedServiceNames}\nБръснар: ${selectedBarberName}\nДата: ${booking.date ?? ''} ${booking.time ?? ''}\nИме: ${booking.name}\nТел: ${booking.phone}`
  );

  // Calendar
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const { startPad, daysInMonth } = calendarDays(calMonth.year, calMonth.month);
  const monthName = new Date(calMonth.year, calMonth.month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  const slots = booking.date ? generateSlots(booking.date) : [];

  return (
    <section id="booking" className="py-24 lg:py-32 bg-bk-raised">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="gold-rule mb-16" />

        <p className="text-bk-gold text-xs tracking-[0.25em] uppercase font-body mb-4">
          {t.booking.section_label}
        </p>
        <h2
          className="font-display font-black text-bk-cream leading-none mb-4"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
        >
          {t.booking.title}
        </h2>
        <p className="font-accent italic text-bk-muted text-lg mb-12">
          {t.booking.subtitle}
        </p>

        {/* Step indicators */}
        {step !== 'success' && (
          <div className="flex items-center gap-0 mb-12 overflow-x-auto">
            {STEP_ORDER.map((s, i) => {
              const done = stepIndex > i;
              const active = stepIndex === i;
              return (
                <div key={s} className="flex items-center">
                  <button
                    onClick={() => done ? goTo(s) : undefined}
                    disabled={!done}
                    className={`flex flex-col items-center gap-1 px-3 ${done ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center text-sm font-display font-bold transition-colors duration-300 ${
                      done ? 'bg-bk-gold text-bk-black' :
                      active ? 'border-2 border-bk-gold text-bk-gold' :
                      'border border-bk-border text-bk-border'
                    }`}>
                      {done ? '✓' : STEP_ICON[s]}
                    </div>
                    <span className={`text-xs tracking-wider uppercase font-body whitespace-nowrap ${
                      active ? 'text-bk-gold' : done ? 'text-bk-muted' : 'text-bk-border'
                    }`}>
                      {t.booking.steps[s as keyof typeof t.booking.steps]}
                    </span>
                  </button>
                  {i < STEP_ORDER.length - 1 && (
                    <div className={`w-8 lg:w-16 h-px transition-colors duration-300 ${i < stepIndex ? 'bg-bk-gold' : 'bg-bk-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Step content */}
        <div className="bg-bk-surface border border-bk-border step-enter" key={step}>

          {/* STEP 1 — Services */}
          {step === 'services' && (
            <div className="p-8">
              <h3 className="font-display font-bold text-bk-cream text-2xl mb-2">{t.booking.step1.title}</h3>
              <p className="font-body text-bk-muted text-sm mb-8">{t.booking.step1.subtitle}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-bk-border">
                {serviceItems.map((svc) => {
                  const sel = booking.services.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      onClick={() => toggleService(svc.id)}
                      className={`p-5 text-left transition-all duration-200 bg-bk-black flex flex-col gap-2 ${
                        sel ? 'border border-bk-gold' : 'border border-transparent hover:border-bk-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-bk-cream text-sm">{svc.name}</span>
                        <div className={`w-5 h-5 border transition-colors flex items-center justify-center text-xs ${
                          sel ? 'bg-bk-gold border-bk-gold text-bk-black' : 'border-bk-border text-transparent'
                        }`}>✓</div>
                      </div>
                      <span className="font-body text-bk-muted text-xs leading-snug">{svc.desc}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => goTo('barber')}
                  disabled={booking.services.length === 0}
                  className="px-8 py-3 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t.booking.step1.next} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Barber */}
          {step === 'barber' && (
            <div className="p-8">
              <h3 className="font-display font-bold text-bk-cream text-2xl mb-2">{t.booking.step2.title}</h3>
              <p className="font-body text-bk-muted text-sm mb-8">{t.booking.step2.subtitle}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-bk-border">
                {/* No preference */}
                <button
                  onClick={() => setBooking((b) => ({ ...b, barber: null }))}
                  className={`p-5 text-left bg-bk-black flex flex-col gap-2 transition-all duration-200 ${
                    booking.barber === null ? 'border border-bk-gold' : 'border border-transparent hover:border-bk-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-bk-cream text-sm">{t.booking.step2.no_preference}</span>
                    <div className={`w-5 h-5 border flex items-center justify-center text-xs ${
                      booking.barber === null ? 'bg-bk-gold border-bk-gold text-bk-black' : 'border-bk-border text-transparent'
                    }`}>✓</div>
                  </div>
                  <span className="font-body text-bk-muted text-xs">{t.booking.step2.no_preference_desc}</span>
                </button>

                {barberItems.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => setBooking((b) => ({ ...b, barber: barber.id }))}
                    className={`p-5 text-left bg-bk-black flex flex-col gap-2 transition-all duration-200 ${
                      booking.barber === barber.id ? 'border border-bk-gold' : 'border border-transparent hover:border-bk-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-bk-cream text-sm">{barber.name}</span>
                      <div className={`w-5 h-5 border flex items-center justify-center text-xs ${
                        booking.barber === barber.id ? 'bg-bk-gold border-bk-gold text-bk-black' : 'border-bk-border text-transparent'
                      }`}>✓</div>
                    </div>
                    <span className="font-body text-bk-gold text-xs">{barber.specialty}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => goTo('services')} className="px-6 py-3 border border-bk-border text-bk-muted font-body text-sm tracking-wider hover:border-bk-gold hover:text-bk-cream transition-colors duration-300">
                  ← Back
                </button>
                <button onClick={() => goTo('datetime')} className="px-8 py-3 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300">
                  {t.booking.step2.next} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Date & Time */}
          {step === 'datetime' && (
            <div className="p-8">
              <h3 className="font-display font-bold text-bk-cream text-2xl mb-2">{t.booking.step3.title}</h3>
              <p className="font-body text-bk-muted text-sm mb-8">{t.booking.step3.subtitle}</p>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCalMonth((m) => {
                        const d = new Date(m.year, m.month - 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })}
                      className="text-bk-muted hover:text-bk-cream p-2 transition-colors"
                    >←</button>
                    <span className="font-display font-bold text-bk-cream text-sm tracking-wider uppercase">
                      {monthName}
                    </span>
                    <button
                      onClick={() => setCalMonth((m) => {
                        const d = new Date(m.year, m.month + 1);
                        return { year: d.getFullYear(), month: d.getMonth() };
                      })}
                      className="text-bk-muted hover:text-bk-cream p-2 transition-colors"
                    >→</button>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-bk-border mb-px">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                      <div key={i} className={`py-2 text-center text-xs font-body tracking-wider bg-bk-black ${i === 6 ? 'text-bk-muted/40' : 'text-bk-muted'}`}>
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-bk-border">
                    {[...Array(startPad)].map((_, i) => (
                      <div key={`pad-${i}`} className="cal-day bg-bk-black disabled" />
                    ))}
                    {[...Array(daysInMonth)].map((_, i) => {
                      const dayNum = i + 1;
                      const d = new Date(calMonth.year, calMonth.month, dayNum);
                      const isSun = d.getDay() === 0;
                      const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const isFar = d > maxDate;
                      const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const isSelected = booking.date === dateStr;
                      const isToday = dateStr === today.toISOString().split('T')[0];
                      const disabled = isSun || isPast || isFar;
                      return (
                        <div
                          key={dayNum}
                          onClick={() => !disabled && setBooking((b) => ({ ...b, date: dateStr, time: null }))}
                          className={`cal-day bg-bk-black ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday && !isSelected ? 'today' : ''} ${isSun ? 'text-bk-muted/30' : ''}`}
                        >
                          {dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  {!booking.date ? (
                    <p className="font-body text-bk-muted text-sm text-center mt-8">← Pick a date first</p>
                  ) : slots.length === 0 ? (
                    <p className="font-body text-bk-muted text-sm text-center mt-8">{t.booking.step3.no_slots}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-px bg-bk-border">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBooking((b) => ({ ...b, time: slot }))}
                          className={`py-3 text-center font-body text-sm bg-bk-black transition-all duration-200 ${
                            booking.time === slot
                              ? 'bg-bk-gold text-bk-black font-bold'
                              : 'text-bk-muted hover:text-bk-cream hover:bg-bk-raised'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => goTo('barber')} className="px-6 py-3 border border-bk-border text-bk-muted font-body text-sm tracking-wider hover:border-bk-gold hover:text-bk-cream transition-colors duration-300">
                  ← Back
                </button>
                <button
                  onClick={() => goTo('contact')}
                  disabled={!booking.date || !booking.time}
                  className="px-8 py-3 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t.booking.step3.next} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — Contact */}
          {step === 'contact' && (
            <div className="p-8">
              <h3 className="font-display font-bold text-bk-cream text-2xl mb-2">{t.booking.step4.title}</h3>
              <p className="font-body text-bk-muted text-sm mb-8">{t.booking.step4.subtitle}</p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted">{t.booking.step4.name}</label>
                  <input
                    type="text"
                    value={booking.name}
                    onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
                    placeholder={t.booking.step4.name_placeholder}
                    className={`bg-bk-black border px-4 py-3 font-body text-bk-cream text-sm placeholder:text-bk-border outline-none focus:border-bk-gold transition-colors duration-200 ${errors.name ? 'border-red-700' : 'border-bk-border'}`}
                  />
                  {errors.name && <span className="text-red-500 text-xs font-body">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted">{t.booking.step4.phone}</label>
                  <input
                    type="tel"
                    value={booking.phone}
                    onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
                    placeholder={t.booking.step4.phone_placeholder}
                    className={`bg-bk-black border px-4 py-3 font-body text-bk-cream text-sm placeholder:text-bk-border outline-none focus:border-bk-gold transition-colors duration-200 ${errors.phone ? 'border-red-700' : 'border-bk-border'}`}
                  />
                  {errors.phone && <span className="text-red-500 text-xs font-body">{errors.phone}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted">{t.booking.step4.email}</label>
                  <input
                    type="email"
                    value={booking.email}
                    onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
                    placeholder={t.booking.step4.email_placeholder}
                    className="bg-bk-black border border-bk-border px-4 py-3 font-body text-bk-cream text-sm placeholder:text-bk-border outline-none focus:border-bk-gold transition-colors duration-200"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted">{t.booking.step4.notes}</label>
                  <textarea
                    value={booking.notes}
                    onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                    placeholder={t.booking.step4.notes_placeholder}
                    rows={3}
                    className="bg-bk-black border border-bk-border px-4 py-3 font-body text-bk-cream text-sm placeholder:text-bk-border outline-none focus:border-bk-gold transition-colors duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={() => goTo('datetime')} className="px-6 py-3 border border-bk-border text-bk-muted font-body text-sm tracking-wider hover:border-bk-gold hover:text-bk-cream transition-colors duration-300">
                  ← Back
                </button>
                <button
                  onClick={() => {
                    const errs: Record<string, string> = {};
                    if (!booking.name.trim()) errs.name = t.booking.step4.name_error;
                    if (!validateBgPhone(booking.phone)) errs.phone = t.booking.step4.phone_error;
                    if (Object.keys(errs).length) { setErrors(errs); return; }
                    setErrors({});
                    goTo('review');
                  }}
                  className="px-8 py-3 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300"
                >
                  {t.booking.step4.next} →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 — Review */}
          {step === 'review' && (
            <div className="p-8">
              <h3 className="font-display font-bold text-bk-cream text-2xl mb-2">{t.booking.step5.title}</h3>
              <p className="font-body text-bk-muted text-sm mb-8">{t.booking.step5.subtitle}</p>

              <div className="border border-bk-border divide-y divide-bk-border mb-8">
                {[
                  [t.booking.step5.services_label, selectedServiceNames],
                  [t.booking.step5.barber_label, selectedBarberName],
                  [t.booking.step5.datetime_label, booking.date && booking.time ? `${booking.date} · ${booking.time}` : '—'],
                  [t.booking.step5.name_label, booking.name],
                  [t.booking.step5.phone_label, booking.phone],
                  ...(booking.notes ? [[t.booking.step5.notes_label, booking.notes]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-6 py-4">
                    <span className="font-body text-xs tracking-[0.12em] uppercase text-bk-muted w-32 shrink-0">{label}</span>
                    <span className="font-body text-bk-cream text-sm">{value}</span>
                  </div>
                ))}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm font-body mb-4">{errors.submit}</p>
              )}

              <div className="flex justify-between">
                <button onClick={() => goTo('contact')} className="px-6 py-3 border border-bk-border text-bk-muted font-body text-sm tracking-wider hover:border-bk-gold hover:text-bk-cream transition-colors duration-300">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-4 bg-bk-gold text-bk-black font-display text-sm tracking-widest uppercase hover:bg-bk-gold-light transition-colors duration-300 disabled:opacity-50"
                >
                  {submitting ? t.booking.step5.submitting : t.booking.step5.submit}
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div className="p-12 text-center flex flex-col items-center gap-8">
              <div className="w-20 h-20 border-2 border-bk-gold flex items-center justify-center">
                <span className="text-bk-gold font-display font-black text-3xl">✓</span>
              </div>
              <div>
                <h3 className="font-display font-black text-bk-cream text-3xl mb-3">
                  {t.booking.success.title}
                </h3>
                <p className="font-body text-bk-muted max-w-sm mx-auto leading-relaxed">
                  {t.booking.success.body}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${PHONE}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-display text-sm tracking-widest uppercase hover:brightness-110 transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.booking.success.whatsapp}
                </a>
                <button
                  onClick={downloadICS}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-bk-border text-bk-muted font-display text-sm tracking-widest uppercase hover:border-bk-gold hover:text-bk-gold transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  {t.booking.success.calendar}
                </button>
              </div>
              <button
                onClick={() => {
                  setStep('services');
                  setBooking({ services: [], barber: null, date: null, time: null, name: '', phone: '', email: '', notes: '' });
                }}
                className="font-body text-xs tracking-wider text-bk-muted hover:text-bk-cream transition-colors duration-300 underline underline-offset-4"
              >
                {t.booking.success.new_booking}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
