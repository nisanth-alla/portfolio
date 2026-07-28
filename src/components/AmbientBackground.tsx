export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--grid-dot) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-[360px] w-[360px] rounded-full bg-accent-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-[280px] w-[520px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
    </div>
  );
}
