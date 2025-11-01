import featureOwnership from "@/assets/feature-ownership.png";
import featureMobile from "@/assets/feature-mobile.png";
import featureFees from "@/assets/feature-fees.png";
import featureCrossGame from "@/assets/feature-cross-game.png";

const features = [
  {
    title: "True Ownership",
    description: "Every skin, weapon, and asset you own is backed by blockchain.",
    image: featureOwnership,
  },
  {
    title: "Mobile-First",
    description: "Trade gaming items on-the-go, anytime, anywhere.",
    image: featureMobile,
  },
  {
    title: "Low Fees, Fast Trades",
    description: "Powered by cutting-edge Web3 infrastructure.",
    image: featureFees,
  },
  {
    title: "Cross-Game Potential",
    description: "Items that outlive a single game, powered by blockchain.",
    image: featureCrossGame,
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative" id="why-starken">
      <div className="container px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-2">Why Starken</p>
          <h2 className="text-4xl font-bold mb-4">Why Gamers Choose Starken</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-6 flex justify-center">
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-contain drop-shadow-xl transition-transform group-hover:scale-110"
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
