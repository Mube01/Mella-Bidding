import Header from "./components/Header";
import Hero from "./components/Hero";
import Auctions from "./components/Auctions";
import HowItWorks from "./components/HowItWorks";
import TrustSection from "./components/TrustSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white noise">
      <Header />

      <Hero />

      <Auctions />

      <HowItWorks />

      <TrustSection />

      <Footer />
    </main>
  );
}