import { Backdrop } from "@/components/fx/Backdrop";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import {
  LiveTicker,
  Features,
  HowItWorks,
  CTA,
  Footer,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <main className="relative min-h-dvh">
      <Backdrop />
      <Navbar />
      <Hero />
      <LiveTicker />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
