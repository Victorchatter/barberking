import type { Metadata } from 'next';
import { Big_Shoulders, Syne, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
  weight: ['700', '900'],
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'THE BARBER KING — Бръснарски салон Варна | Barbershop Varna',
  description: 'Най-доверяваният бръснарски салон във Варна. 4.9★ от 228 отзива. Подстригване, оформяне на брада, по предварителен час. | Varna\'s finest barbershop. 4.9★ from 228 reviews.',
  keywords: ['бръснарски салон варна', 'barbershop varna', 'подстригване варна', 'оформяне брада варна', 'barber varna', 'the barber king'],
  openGraph: {
    title: 'THE BARBER KING — Бръснарски салон Варна',
    description: 'Прецизност. Уважение. Нулево чакане. | Precision. Respect. Zero waiting.',
    type: 'website',
    locale: 'bg_BG',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BarberShop',
  name: 'The Barber King',
  image: '/images/hero/hero-main.jpg',
  '@id': 'https://thebarberkingvarna.com',
  url: 'https://thebarberkingvarna.com',
  telephone: '+359896175008',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. „Доктор Пискюлиев" 72',
    addressLocality: 'Варна',
    postalCode: '9000',
    addressCountry: 'BG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.2100018,
    longitude: 27.9039927,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:30', closes: '18:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '228',
    bestRating: '5',
  },
  sameAs: [
    'https://www.instagram.com/the_barber_kingg/',
    'https://www.facebook.com/The-Barber-KING-109207757505223',
  ],
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="bg"
      className={`${bigShoulders.variable} ${syne.variable} ${cormorant.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* GA4 placeholder — replace UA with real Measurement ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" /> */}
        {/* Meta Pixel placeholder */}
        {/* Add fbq snippet here when ready */}
      </head>
      <body className="min-h-full bg-bk-black text-bk-cream font-body antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
