import Image from "next/image";
import TitleSection from "./TitleSection";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Secure & Reliable",
      description:
        "Share shortlinks with confidence — every click is safe, secure, and built on trusted protection.",
      icons: "iconoir--security-pass",
    },
    {
      id: 2,
      title: "Custom Shortlinks",
      description:
        "Create unique, memorable, and brand-friendly links with custom aliases.",
      icons: "system-uicons--create",
    },
    {
      id: 3,
      title: "Fast Response Support",
      description:
        "We're here to help — our support team is available 24/7 to address any concerns you may have.",
      icons: "tabler--mail-fast",
    },
    {
      id: 4,
      title: "High Rate CPM",
      description:
        "Earn more as your traffic scales — higher quality means higher CPM rewards across global audiences.",
      icons: "ci--chart-line",
    },
    {
      id: 5,
      title: "Low Minimum Payout",
      description:
        "Cash out your earnings faster with a low payout threshold, no long waiting time.",
      icons: "hugeicons--payment-success-01",
    },
    {
      id: 6,
      title: "Referral Links",
      description:
        "Invite friends, share special referral links, and earn extra rewards.",
      icons: "tabler--user-dollar",
    },
  ];
  return (
    <>
      <div id="features" className="max-w-[155em] font-figtree m-auto relative text-[9px] sm:text-[10px] bg-white ">
        <div className="max-w-[140em] px-[1.6em] md:px-[2.4em] lg:px-[4em] py-[10em] md:py-[15em] mx-auto space-y-[12em] ">
          <div className="text-shortblack space-y-[3em]">
            <TitleSection
              pClassName="sm:w-[25em] w-full"
              pText="Packed with simple yet powerful tools to make every link cleaner, smarter, and more useful."
              sectionText="Features"
              h1Text="Why Choose Our Shortenlinks?"
              parentClassName="text-center justify-center items-center"
              h1ClassName="text-center justify-center items-center"
            />
          </div>
          <div className="flex justify-center items-center gap-[5em] flex-wrap flex-col lg:flex-row relative">
            <div className="absolute -top-[2em] left-[5em] rotate-[25deg]  p-[2em] bg-yellowlink rounded-2xl">
              <div className="p-[1.5em] rounded-full shadow-md shadow-slate-500/40 bg-white">
                <Image
                  src="/landing/shortlinku.svg"
                  alt="shortlink"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div className="absolute top-[55em] right-[5em] -rotate-[25deg]  p-[2em] bg-purplelink rounded-2xl">
              <div className="p-[1em] rounded-full shadow-md shadow-slate-500/40 bg-white">
                <Image
                  src="/landing/vinlogo.svg"
                  alt="shortlink"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <div className="absolute bottom-[30em] left-[5em] rotate-[25deg] p-[2em] bg-bluelight rounded-2xl">
              <div className="p-[1em] rounded-full shadow-md shadow-slate-500/40 bg-white">
                <Image
                  src="/landing/vinlogo-blue.svg"
                  alt="shortlink"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            {features.map((item) => (
              <div
                key={item.id}
                className="sm:p-[3em] p-[2em] shadow-md shadow-slate-500/40 rounded-2xl lg:w-[45%] xl:w-[40%] sm:w-[70%] w-full space-y-[3em]"
              >
                <div className="sm:h-[28em] h-[50vw] bg-card rounded-xl"></div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col justify-start gap-[1em] font-geist w-[70%]">
                    <h1 className="text-[2.4em] font-semibold tracking-tight">
                      {item.title}
                    </h1>
                    <p className="text-[1.6em] line-clamp-2 tracking-tight text-grays">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={`${item.icons} w-[6em] h-[6em] bg-bluelight pe-[8em]`}
                  ></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
