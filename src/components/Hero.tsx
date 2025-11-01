import { Button } from "@/components/ui/button";
import heroPhone from "@/assets/hero-phone.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

      <div className="container relative z-10 px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Own. Trade. Dominate.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              The mobile-first gaming items marketplace where gamers unlock, trade, chat and flex in-game items like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-base">
                Get Early Access
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Explore Marketplace
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl rounded-full" />
              <img
                src={heroPhone}
                alt="Starken mobile app interface"
                className="relative z-10 w-full max-w-sm lg:max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated line divider */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </section>
  );
};
