const phases = [
  {
    phase: "Phase 1",
    description: "MVP launch (BTC payments + NFT trading + Private messaging)",
  },
  {
    phase: "Phase 2",
    description: "Expand supported assets and games, UX enhancements, Based on Web2app messaging",
  },
  {
    phase: "Phase 3",
    description: "DAO governance, trader reputation system",
  },
  {
    phase: "Phase 4",
    description: "AI Agent integration (price recommendations, auto-negotiation, fraud detection)",
  },
];

export const Roadmap = () => {
  return (
    <section className="py-24 relative" id="roadmap">
      <div className="container px-4">
        <div className="text-right mb-16">
          <h2 className="text-4xl font-bold">Roadmap</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />

          <div className="space-y-12">
            {phases.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6">
                    <h3 className="text-xl font-semibold mb-2">{item.phase}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-primary border-4 border-background shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
