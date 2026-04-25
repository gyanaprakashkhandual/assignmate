import Navbar from "../home/Navbar.home";
import Hero from "../home/Hero.home";
import StatsNumbers from "../home/Stat.home";
import Features from "../home/Features.home";
import GettingStarted from "../home/GS.home";
import UseCases from "../home/UseCase.home";
import Feedback from "../home/Feedback.home";
import CTA from "../home/CTA.home";
import Subscribe from "../home/Subscribe";
import Footer from "../home/Footer.home";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      <Hero />
      <StatsNumbers />
      <Features />
      <GettingStarted />
      <UseCases />
      <Feedback />
      <CTA />
      <Subscribe />
      <Footer />
    </main>
  );
}