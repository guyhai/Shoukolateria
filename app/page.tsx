import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Workshops from '@/components/Workshops'
import BookingSection from '@/components/BookingSection'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Workshops />
        <BookingSection />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}
