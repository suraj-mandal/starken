import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ItemsShowcase } from "@/components/ItemsShowcase";
import { HowItWorks } from "@/components/HowItWorks";
import { Roadmap } from "@/components/Roadmap";
import { Partners } from "@/components/Partners";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Features />
      <ItemsShowcase />
      <HowItWorks />
      <Roadmap />
      <Partners />
      <Footer />
    </div>
  );
};

export default Index;
