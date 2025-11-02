

const TitleSection = ({
  parentClassName,
  sectionClassName = "text-start",
  h1ClassName = "text-start",
  pClassName = "text-start",
  sectionText = "Shortlink",
  h1Text = "Easiest and most trusted link shortener",
  pText = "Turn long, messy URLs into short, clean links you can share anywhere.",
}: any) => {
  return (
    <div className={`flex flex-col gap-[1.6em] ${parentClassName}`}>
      <div
        className={`bg-bluelight text-[1.6em] text-white px-[2em] rounded-full py-[.5em] w-fit ${sectionClassName}`}
      >
        {sectionText}
      </div>
      <h1
        className={` font-bold text-shortblack m-0 p-0 text-4xl sm:text-5xl tracking-tight ${h1ClassName}`}
      >
        {h1Text}
      </h1>
      <p className={`text-[2em] font-medium text-grays ${pClassName}`}>{pText}</p>
    </div>
  );
};

export default TitleSection;
