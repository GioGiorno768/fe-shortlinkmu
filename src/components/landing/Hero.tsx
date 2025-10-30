import CardHero from "./CardHero";
import ShortLink from "./ShortLink";
import TitleSection from "./TitleSection";

export default function Hero() {
  return (
    <>
      <section className="max-w-[150em] m-auto relative text-[9px] sm:text-[10px] ">
        <div className="max-w-[140em] px-[1.6em] sticky top-0 md:px-[2.4em] lg:px-[4em] pt-[10em] md:pt-[10em] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-start  gap-[5em]">
          {/* Left side */}
          <div className="font-figtree text-shortblack w-full lg:w-[45%] space-y-[3em]">
            <TitleSection parentClassName="text-center " />
            <ShortLink />
          </div>
          {/* Right side */}
          <div className="font-figtree text-shortblack w-full lg:w-fit hidden sm:block ">
            <CardHero />
          </div>
        </div>
      </section>
    </>
  );
}
