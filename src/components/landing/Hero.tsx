import { useTranslations } from "next-intl";
import CardHero from "./CardHero";
import ShortLink from "./ShortLink";
import TitleSection from "./TitleSection";

export default function Hero() {
  const t = useTranslations("Hero"); // [TAMBAH]
  return (
    <>
      <section className="max-w-[150em] m-auto relative text-[9px] sm:text-[10px] ">
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] pt-[20em] md:pt-[12em] lg:pt-[9em] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-start  gap-[5em]">
          {/* Left side */}
          <div className="font-figtree text-shortblack w-full lg:w-[45%] space-y-[3em]">
            {/* [UBAH] Ambil teks dari 't' (JSON) */}
            <TitleSection
              parentClassName="text-center "
              sectionText="Join Now" // Ini bisa di-translate juga kalo mau
              h1Text={t("title")}
              pText={t("description")}
            />
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
