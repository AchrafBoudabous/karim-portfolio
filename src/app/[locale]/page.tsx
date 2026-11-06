import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Partners from "@/components/sections/Partners";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Gallery from "@/components/sections/Gallery";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import FloatingBookingButton from "@/components/ui/FloatingBookingButton";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main" className="relative">
        <Hero />
        <Partners />
        <About />
        <Services />
        <Experience />
        <Gallery />
        <Education />
        <Contact />
      </main>
      <Footer />
      <FloatingBookingButton />
    </>
  );
}
