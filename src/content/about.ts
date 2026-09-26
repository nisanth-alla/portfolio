export const about = {
  bio: "I build things because I keep running into problems that don't have the right tool yet. SyncMark started because I used Chrome and Arc across separate work profiles and no sync tool understood what a profile even was. FoxPilot started because I watched a job search eat hours without producing a useful signal. Both are still in active development alongside my day-to-day production engineering work.",
  philosophy:
    "The most durable software I've seen is built simply enough that the next person can reason about it. I'm expanding into backend systems, cloud infrastructure and distributed design because the problems I want to work on need an understanding of the whole stack.",
};

/** Split the philosophy into a pull-quote and its supporting sentence(s). */
export function philosophyParts() {
  const [quote, ...rest] = about.philosophy.split(/(?<=\.)\s+/);
  return { quote, rest: rest.join(" ") };
}
