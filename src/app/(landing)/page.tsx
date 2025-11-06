import CTASection from "@/components/landing/CTASection";
import FAQSection from "@/components/landing/FAQSection";
import Features from "@/components/landing/Features";
import FloatingNavbar from "@/components/landing/FloatingNavbar";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import StatsSection from "@/components/landing/StatsSection";

export default function Home() {
  return (
    <>
      <main className="text-[10px] max-w-[155em] m-auto">
        <div className="m-auto sticky h-[100vh] top-0 w-full bg-white overflow-hidden ">
          <div
            className="absolute  top-0 -right-[13em] h-full w-[55%] bg-bluelight"
            style={{
              // Kita pakai clip-path untuk membuat bentuk miringnya
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          ></div>
          <header>
            <div className="relative z-50">
              <Navbar />
            </div>
          </header>
          <section>
            <Hero />
          </section>
        </div>
        <div className="">
          <FloatingNavbar />
          <section>
            <Features />
          </section>
          <section>
            <StatsSection />
          </section>
          <section className="bg-white">
            <FAQSection />
          </section>
          <section>
            <CTASection />
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}
