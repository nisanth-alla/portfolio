import type { CSSProperties } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/Section";
import { Ticker } from "@/components/ui/Ticker";
import { about, philosophyParts } from "@/content/about";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { publications } from "@/content/publications";
import { recognition } from "@/content/recognition";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function About() {
  const { quote, rest } = philosophyParts();
  const years = new Date().getFullYear() - profile.careerStartYear;
  const inPrep = publications.filter((p) => p.status === "in-preparation").length;

  const stats = [
    { value: `${years}+`, label: "years building software professionally" },
    { value: String(projects.length), label: "projects built end to end" },
    {
      value: String(publications.length),
      label: inPrep ? `research papers · ${inPrep} in preparation` : "research papers",
    },
    { value: String(recognition.length), label: "awards for ownership and delivery" },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-line" style={{ scrollMarginTop: 72 }}>
      <Reveal className="wrap py-[80px] md:py-[112px]">
        <SectionHead
          id="about"
          title="About me"
        />
        <div
          className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14"
          data-reveal-item
          style={step(1)}
        >
          <p className="m-0 text-[17.5px] leading-8 text-muted">{about.bio}</p>
          <dl className="win spot m-0 self-start">
            {[...profile.highlights, { label: "Experience", value: `${years}+ years · since ${profile.careerStartYear}` }].map(
              (item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 border-t border-line px-5 py-4 first:border-t-0"
                >
                  <dt className="label pt-0.5">{item.label}</dt>
                  <dd className="m-0 text-[14px] font-medium text-foreground">{item.value}</dd>
                </div>
              ),
            )}
          </dl>
        </div>
      </Reveal>

      <div className="band">
        <Reveal className="wrap py-20 md:py-28">
          <p className="eyebrow" data-reveal-item>
            <b>§</b>
            <span>Engineering philosophy</span>
          </p>
          <blockquote
            className="m-0 mt-6 max-w-4xl text-[clamp(1.7rem,3.6vw,2.85rem)] font-semibold leading-[1.12] tracking-[-0.04em]"
            data-reveal-item
            style={step(1)}
          >
            <span aria-hidden className="mr-1 text-saffron">
              “
            </span>
            {quote}
            <span aria-hidden className="text-saffron">
              ”
            </span>
          </blockquote>
          <p className="mt-6 max-w-2xl text-[16.5px] leading-7 text-band-foreground/80" data-reveal-item style={step(2)}>
            {rest}
          </p>
          <div className="stat-grid mt-12" data-reveal-item style={step(3)}>
            {stats.map((stat) => (
              <div key={stat.label} className="stat">
                <p className="stat-value m-0">
                  <Ticker value={stat.value} />
                </p>
                <p className="stat-label mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}