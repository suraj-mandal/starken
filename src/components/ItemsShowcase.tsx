import { Button } from "@/components/ui/button";
import itemsPhone from "@/assets/items-phone.png";

export const ItemsShowcase = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10 px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Your Items, Your Rules
            </h2>
            <p className="text-lg text-muted-foreground">
              From rare skins to legendary weapons, Starken is the ultimate hub for gamers who value true digital ownership. Buy, sell, and showcase items in seconds.
            </p>
            <div>
              <Button size="lg">
                Join Now
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl" />
              <img
                src={itemsPhone}
                alt="Gaming items marketplace"
                className="relative z-10 w-full max-w-sm drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
