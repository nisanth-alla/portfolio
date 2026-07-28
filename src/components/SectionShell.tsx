import { ScrollReveal } from "@/components/ScrollReveal";

type SectionShellProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "muted";
};

export function SectionShell({
  id,
  children,
  className = "",
  tone = "default",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={
        "mx-auto w-full max-w-5xl scroll-mt-24 border-t border-border px-6 py-14 " +
        (tone === "muted" ? "section-muted " : "") +
        className
      }
    >
      <ScrollReveal>{children}</ScrollReveal>
    </section>
  );
}
