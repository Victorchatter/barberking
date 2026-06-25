import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Barbers from '@/components/Barbers';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import BookingWizard from '@/components/BookingWizard';
import Location from '@/components/Location';
import Footer from '@/components/Footer';
import MobileCTABar from '@/components/MobileCTABar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Barbers />
        <Gallery />
        <Reviews />
        <BookingWizard />
        <Location />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
