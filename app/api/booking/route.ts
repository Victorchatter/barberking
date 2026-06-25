import { NextResponse } from 'next/server';

interface BookingPayload {
  services: string;
  barber: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

function validatePayload(body: unknown): body is BookingPayload {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.services === 'string' && b.services.length > 0 &&
    typeof b.barber === 'string' &&
    typeof b.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    typeof b.time === 'string' && /^\d{2}:\d{2}$/.test(b.time) &&
    typeof b.name === 'string' && b.name.trim().length > 0 &&
    typeof b.phone === 'string' && /^(\+359|0)(8[7-9])\d{7}$/.test((b.phone as string).replace(/\s/g, ''))
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!validatePayload(body)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 422 });
  }

  const booking = body;

  // ─── Notification ──────────────────────────────────────────────────────────
  // Option A — Email (Resend or Nodemailer). Plug in RESEND_API_KEY to .env.local:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'booking@thebarberkingvarna.com',
  //   to: process.env.OWNER_EMAIL!,
  //   subject: `New booking — ${booking.name} on ${booking.date} at ${booking.time}`,
  //   text: `Services: ${booking.services}\nBarber: ${booking.barber}\nDate: ${booking.date} ${booking.time}\nName: ${booking.name}\nPhone: ${booking.phone}\nNotes: ${booking.notes ?? 'none'}`,
  // });
  //
  // Option B — Telegram bot push. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID in .env.local:
  //
  // await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: `...` }),
  // });
  // ───────────────────────────────────────────────────────────────────────────

  // ─── Persistence ───────────────────────────────────────────────────────────
  // Option A — Google Sheet via service account (good for owner who wants a spreadsheet).
  // Option B — append to a local JSON file (zero-infra, fine for low volume).
  // Option C — insert into Supabase/Postgres table.
  //
  // Minimal local append example (Node.js):
  // import { appendFileSync } from 'fs';
  // appendFileSync('bookings.ndjson', JSON.stringify({ ...booking, createdAt: new Date().toISOString() }) + '\n');
  // ───────────────────────────────────────────────────────────────────────────

  // Log for now so nothing is lost in development
  console.log('[BOOKING]', {
    ...booking,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, message: 'Booking received' }, { status: 200 });
}
