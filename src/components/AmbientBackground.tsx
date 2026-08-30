export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--grid-dot) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Single contained top wash — accent fades into transparent below the hero */}
      <div
        className="absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 0%, color-mix(in oklab, var(--accent) 7%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
