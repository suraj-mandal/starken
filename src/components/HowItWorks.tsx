import { Wallet, Search, Gamepad2 } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Easy sign-in with your favorite wallet.",
  },
  {
    icon: Search,
    title: "Discover Items",
    description: "Browse exclusive NFT drops and collections.",
  },
  {
    icon: Gamepad2,
    title: "Trade, Chat & Play",
    description: "Buy, sell, chat and flex items in-game.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24" id="how-it-works">
      <div className="container px-4">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary mb-2">How It Works</p>
          <h2 className="text-4xl font-bold">Why Gamers Choose Starken</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
