export default function CardHero() {
  const howto = [
    { id: 1, title: "Create Account", icons: "solar--user-broken" },
    { id: 2, title: "Shorten Links", icons: "hugeicons--link-02" },
    { id: 3, title: "Earn Money", icons: "qlementine-icons--money-16" },
  ];

  return (
    <div className="rounded-3xl shadow-md shadow-slate-500/40 bg-white font-figtree text-[8px] sm:text-[10px] overflow-hidden">
      <div className="p-[3em] space-y-[4em]">
        {/* Header Text */}
        <div className="flex flex-col gap-[2em]">
          <div className="bg-bluelight text-[1.6em] text-white px-[2em] rounded-full py-[.5em] w-fit">
            Join Now
          </div>
          <div className="flex flex-col gap-[1em]">
            <h1 className="font-bold m-0 p-0 text-4xl text-bluelight sm:text-[3.5em] tracking-tight leading-tight max-w-[12em]">
              Make money from the links you create
            </h1>
            <p className="text-[1.8em] text-slate-600">
              No hidden fees, just real earnings from your links
            </p>
          </div>
        </div>

        {/* How-To Cards */}
        <div className="w-full flex-wrap sm:flex-nowrap flex justify-center md:justify-between items-center gap-[3.5em]">
          {howto.map((item) => (
            <div
              key={item.id}
              className="w-full lg:w-fit flex flex-col items-center justify-center py-[1.5em] px-[3em] rounded-xl shadow-sm shadow-slate-500/40 gap-[1.4em] hover:shadow-xl hover:shadow-slate-500/40 hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="w-[6em] h-[6em] rounded-full shadow-sm shadow-slate-500/40 flex justify-center items-center">
                <span
                  className={`${item.icons} w-[3em] h-[3em] bg-bluelight`}
                ></span>
              </div>
              <h1 className="m-0 p-0 font-medium w-fit lg:w-[5em] text-[1.6em] tracking-tight text-center">
                {item.title}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
