import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatsCounter } from "@/components/StatsCounter";
import { Benefits } from "@/components/Benefits";
import { SpecialOffers } from "@/components/SpecialOffers";
import { Testimonials } from "@/components/Testimonials";
import { TrustIndicators } from "@/components/TrustIndicators";
import { LoanForm } from "@/components/LoanForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <StatsCounter />
        <Benefits />
        <SpecialOffers />
        <Testimonials />
        <TrustIndicators />
        <LoanForm />
      </main>
      <Footer />
    </div>
  );
}
