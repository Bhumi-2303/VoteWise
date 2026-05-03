import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import BentoGrid from "@/components/sections/BentoGrid";
import CandidateComparison from "@/components/sections/CandidateComparison";
import DistrictLookup from "@/components/sections/DistrictLookup";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      
      <Hero />
      
      <div className="relative">
        <BentoGrid />
      </div>

      <CandidateComparison />
      
      <DistrictLookup />

      <Footer />
      
      <ChatWidget />
    </main>
  );
}
