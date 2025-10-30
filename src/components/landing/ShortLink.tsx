export default function ShortLink() {
  return (
    <>
      <form className="flex gap-[2em] w-full ">
        <input
          type="text"
          id="hero-input"
          name="hero-input"
          className="py-[1em] sm:py-[1em] px-[2.5em] block w-full shadow-sm shadow-slate-500/40 text-[1.6em] focus:outline-bluelight disabled:opacity-50 disabled:pointer-events-none rounded-full bg-white"
          placeholder="Paste your link here..."
        />
        <button
          type="submit"
          className="text-[1.6em] bg-bluelight text-white px-[2em] rounded-full cursor-pointer "
        >
          Generate
        </button>
      </form>
      <div className="font-figtree">
        <div className="shadow-sm px-[3.5em] py-[2em] shadow-slate-500/40 rounded-3xl flex justify-between items-center bg-white">
          <div className="w-fit flex gap-[3em] items-center">
            <span className="fontisto--link w-[2em] h-[2em] bg-bluelight"></span>
            <div className="gap-[.5em] flex flex-col">
              <span className="text-[1.4em]">Your link</span>
              <a
                href="#"
                className="text-shortblack text-[1.6em] font-semibold"
              >
                short.link/anjay123
              </a>
            </div>
          </div>
          <div className="flex gap-[3em] items-center">
            <button>
              <span className="lets-icons--check-ring-round  w-[3em] h-[3em] bg-greenlight"></span>
            </button>
            <button>
              <span className="meteor-icons--share w-[3em] h-[3em] bg-bluelight"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
