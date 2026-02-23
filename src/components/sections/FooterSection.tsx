import Magnetic from "../Magnetic";

const FooterSection = () => {
  return (
    <section
      id="footer"
      className="min-h-screen flex flex-col justify-end px-8 md:px-16 pb-8 md:pb-16"
      style={{ background: "hsl(var(--section-light))", color: "hsl(0 0% 4%)" }}
    >
      <div className="flex-1 flex items-center">
        <div>
          <h2
            className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to build
            <br />
            the future?
          </h2>
          <Magnetic strength={30} className="inline-block">
            <a
              href="mailto:sakthivel.hsr06@gmail.com"
              className="text-xl md:text-3xl lg:text-4xl font-medium border-b-2 border-current pb-2 hover:opacity-60 transition-opacity duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              sakthivel.hsr06@gmail.com
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-center pt-8 border-t" style={{ borderColor: "hsl(0 0% 80%)" }}>
        <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 40%)" }}>
          Sakthivel © 2026
        </span>
        <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: "hsl(0 0% 40%)" }}>
          Built with only AI — and intention.
        </span>
      </div>
    </section>
  );
};

export default FooterSection;
