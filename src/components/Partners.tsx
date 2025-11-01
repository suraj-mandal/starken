import logoStarkware from "@/assets/logo-starkware.png";
import logoStarknet from "@/assets/logo-starknet.png";
import logoCartridge from "@/assets/logo-cartridge.png";
import logoAtomiq from "@/assets/logo-atomiq.png";
import logoXverse from "@/assets/logo-xverse.png";

export const Partners = () => {
  const partners = [
    { name: "STARKWARE", logo: logoStarkware },
    { name: "STARKNET", logo: logoStarknet },
    { name: "cartridge", logo: logoCartridge },
    { name: "atomiq", logo: logoAtomiq },
    { name: "xverse", logo: logoXverse },
  ];

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Partners</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
