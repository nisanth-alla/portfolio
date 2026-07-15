import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CurrentFocus } from "@/components/sections/CurrentFocus";
import { Education } from "@/components/sections/Education";
import { EngineeringJourney } from "@/components/sections/EngineeringJourney";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { Recognition } from "@/components/sections/Recognition";
import { Writing } from "@/components/sections/Writing";

export default function Home() {
  return (
    <main id="top" className="min-h-screen bg-white text-slate-900">
      <Nav />
      <Hero />
      <EngineeringJourney />
      <About />
      <CurrentFocus />
      <Projects />
      <Publications />
      <Education />
      <Recognition />
      <Writing />
      <Contact />
      <Footer />
    </main>
  );
}
