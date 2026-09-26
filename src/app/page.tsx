import { TopNav } from "@/components/chrome/TopNav";
import { AsciiField } from "@/components/hero/AsciiField";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Craft } from "@/components/sections/Craft";
import { CurrentFocus } from "@/components/sections/CurrentFocus";
import { EngineeringJourney } from "@/components/sections/EngineeringJourney";
import { Footer } from "@/components/sections/Footer";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { StackMarquee } from "@/components/sections/StackMarquee";
import { Writing } from "@/components/sections/Writing";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <>
      <div className="relative">
        <ErrorBoundary name="ascii-field">
          <AsciiField className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[min(100svh,960px)] w-full [mask-image:radial-gradient(ellipse_52%_62%_at_76%_36%,#000_30%,transparent_80%)] md:block" />
        </ErrorBoundary>
        <TopNav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Hero />
          <StackMarquee />
          <Projects />
          <Craft />
          <EngineeringJourney />
          <About />
          <CurrentFocus />
          <ErrorBoundary
            name="github-activity"
            fallback={
              <section id="github" aria-label="GitHub" className="section">
                <div className="wrap">
                  <p className="lede">
                    GitHub activity couldn&apos;t load.{" "}
                    <a className="arrow-link" href={profile.github}>
                      View my profile on GitHub ↗
                    </a>
                  </p>
                </div>
              </section>
            }
          >
            <GitHubActivity />
          </ErrorBoundary>
          <Research />
          <Writing />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}