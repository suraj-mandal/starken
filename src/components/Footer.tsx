import { Button } from "@/components/ui/button";
import { Twitter, Youtube } from "lucide-react";
import logoStarken from "@/assets/logo-starken.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
      {/* CTA Section */}
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-primary">
            Ready to Own the Future of Gaming?
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Be the first to experience the next era of digital item ownership
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg">
              Get Early Access
            </Button>
            <Button size="lg" variant="outline">
              Join Our Community
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-border/40">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={logoStarken} 
                alt="Starken logo" 
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold">Starken</span>
            </div>

            <nav className="flex items-center gap-6">
              <a
                href="#about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </a>
              <a
                href="#roadmap"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Roadmap
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
