import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import Gallery from "@/components/sections/Gallery";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Experience />
      <Gallery />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}