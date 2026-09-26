/**
 * Terminal command handling: a pure mapping from typed input to output.
 * Side effects (navigation, theme, clipboard) are returned as `action`
 * callbacks so the UI decides when to run them.
 */
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { projects, statusLabel, type Project } from "@/content/projects";
import { toolbelt } from "@/content/stack";
import { journalHome } from "@/content/writing";
import { jumpTo } from "@/lib/scroll";
import type { SfxName } from "@/lib/sfx";
import { levenshtein } from "@/lib/text";
import { switchTheme } from "@/lib/theme-transition";

export type Block = { id: number; cmd?: string; time?: string; out: React.ReactNode };

export type Env = {
  soundOn: boolean;
  theme: "light" | "dark";
  history: string[];
  toggleSound: () => void;
};

export type Result = {
  out: React.ReactNode;
  clear?: boolean;
  action?: () => void;
  sound?: SfxName;
};

export const DIR = "~/nisanth";
export const CHIPS = ["whoami", "projects", "stack", "now", "contact", "help"];
const FILES = ["about.md", "contact.txt", "resume.pdf", "projects/", "writing/"];

const HELP: Array<[string, string]> = [
  ["whoami", "who is this"],
  ["projects", "selected work · then open <name>"],
  ["stack", "tools I reach for"],
  ["now", "what I'm working on"],
  ["about", "the short version"],
  ["contact", "ways to reach me · copy email"],
  ["resume", "open the pdf"],
  ["theme", "toggle light / dark"],
  ["sound", "toggle ui sounds"],
  ["clear", "clear the screen (ctrl+l)"],
];

const SUGGESTIONS = [
  ...HELP.map(([cmd]) => cmd),
  "copy email",
  "github",
  "linkedin",
  "journal",
  "history",
  "date",
  "ls",
  "sudo hire nisanth",
  ...projects.map((p) => `open ${p.id}`),
  "open github",
  "open linkedin",
  "open resume",
  "open journal",
  "theme light",
  "theme dark",
  "sound on",
  "sound off",
  ...FILES.map((f) => `cat ${f}`),
];

const EXTERNAL: Record<string, string> = {
  github: profile.github,
  linkedin: profile.linkedin,
  resume: profile.resume,
  journal: journalHome,
};

const ok = <span className="o-s">[ok]</span>;
const bad = <span className="o-e">[!!]</span>;

export function stamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatTime(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

export function suggest(value: string) {
  if (!value.trim()) return "";
  const lower = value.toLowerCase();
  const hit = SUGGESTIONS.find((s) => s.startsWith(lower) && s.length > lower.length);
  return hit ? hit.slice(value.length) : "";
}

function findProject(query: string): Project | undefined {
  const q = query.toLowerCase().replace(/\/$/, "");
  return (
    projects.find((p) => p.id === q || p.name.toLowerCase() === q) ??
    projects.find((p) => p.id.startsWith(q) || p.name.toLowerCase().startsWith(q)) ??
    projects.find((p) => p.id.includes(q))
  );
}

function openExternal(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function toneMark(tone: "ok" | "wait" | "live") {
  if (tone === "ok") return <span className="o-s">[ok]</span>;
  if (tone === "wait") return <span className="o-w">[..]</span>;
  return <span className="o-k">[●]</span>;
}

function projectList() {
  return (
    <>
      {projects.map((p) => {
        const status = statusLabel[p.status];
        return (
          <span key={p.id}>
            <a href={`#projects-${p.id}`}>{p.id}/</a>
            {" ".repeat(Math.max(2, 25 - p.id.length))}
            {toneMark(status.tone)} {status.text.padEnd(8)}
            <span className="o-c">{p.stack.slice(0, 3).join(" · ").toLowerCase()}</span>
            {"\n"}
          </span>
        );
      })}
      <span className="o-c">→ open &lt;name&gt; for the case study, e.g. open foxpilot</span>
    </>
  );
}

function contactCard() {
  return (
    <>
      <span className="o-k">{"email".padEnd(10)}</span>
      <a href={profile.emailLink}>{profile.email}</a> <span className="o-c">(copy email)</span>
      {"\n"}
      <span className="o-k">{"linkedin".padEnd(10)}</span>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
        in/nisanth-alla
      </a>
      {"\n"}
      <span className="o-k">{"github".padEnd(10)}</span>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">
        github.com/nisanth-alla
      </a>
    </>
  );
}

export function respond(raw: string, env: Env): Result {
  const input = raw.trim();
  const [head = "", ...rest] = input.split(/\s+/);
  const cmd = head.toLowerCase();
  const arg = rest.join(" ").trim();
  const argLower = arg.toLowerCase();

  switch (cmd) {
    case "help":
    case "man":
      return {
        out: (
          <>
            <span className="o-b">available commands</span>
            {"\n"}
            {HELP.map(([name, desc]) => (
              <span key={name}>
                {"  "}
                <span className="o-k">{name.padEnd(11)}</span>
                <span className="o-c">{desc}</span>
                {"\n"}
              </span>
            ))}
            <span className="o-c">tab completes · ↑↓ history · ⌘k opens the palette</span>
          </>
        ),
      };

    case "whoami":
      return {
        out: (
          <>
            <span className="o-b">{profile.name.toLowerCase()}</span>
            {"\n"}
            {profile.role.toLowerCase()} · react, typescript, production engineering
            {"\n"}
            <span className="o-c">{profile.city.toLowerCase()}, india · ist (utc+5:30)</span>
          </>
        ),
      };

    case "now":
      return {
        out: (
          <>
            <span className="o-w">●</span> {profile.now}
          </>
        ),
      };

    case "about":
      return { out: about.bio };

    case "projects":
    case "work":
      return { out: projectList() };

    case "ls":
      if (argLower.startsWith("projects")) return { out: projectList() };
      return {
        out: (
          <>
            <span className="o-k">projects/</span>
            {"  "}
            <span className="o-k">writing/</span>
            {"  "}about.md{"  "}contact.txt{"  "}resume.pdf
          </>
        ),
      };

    case "cat":
      if (argLower === "about.md") return { out: about.bio };
      if (argLower === "contact.txt") return { out: contactCard() };
      if (argLower === "resume.pdf")
        return { out: <>{bad} binary file — try `resume` instead</>, sound: "error" };
      if (argLower.startsWith("projects") || argLower.startsWith("writing"))
        return { out: <>{bad} cat: {arg}: is a directory</>, sound: "error" };
      return { out: <>{bad} cat: {arg || "?"}: no such file</>, sound: "error" };

    case "open":
    case "cd": {
      if (!argLower || argLower === "~" || argLower === "..")
        return { out: <>usage: open &lt;project | github | linkedin | resume | journal&gt;</> };
      if (argLower === "projects" || argLower === "work")
        return { out: <>{ok} jumping to projects ↓</>, action: () => jumpTo("projects") };
      const external = EXTERNAL[argLower];
      if (external)
        return { out: <>{ok} opening {argLower} ↗</>, action: () => openExternal(external) };
      const project = findProject(argLower);
      if (project)
        return {
          out: (
            <>
              {ok} opening the {project.name} case study ↓
            </>
          ),
          action: () => jumpTo(`projects-${project.id}`),
        };
      return {
        out: (
          <>
            {bad} no project named “{arg}”. try `projects`
          </>
        ),
        sound: "error",
      };
    }

    case "stack":
    case "skills":
      return {
        out: (
          <>
            {profile.highlights.slice(0, 2).map((h) => (
              <span key={h.label}>
                <span className="o-k">{h.label.toLowerCase().padEnd(14)}</span>
                {h.value.toLowerCase()}
                {"\n"}
              </span>
            ))}
            <span className="o-k">{"ships with".padEnd(14)}</span>
            {toolbelt.slice(0, 12).join(" · ")}
          </>
        ),
      };

    case "contact":
    case "email":
      return { out: contactCard() };

    case "copy":
      if (argLower === "email" || argLower === "")
        return {
          out: (
            <>
              {ok} copied {profile.email}
            </>
          ),
          sound: "success",
          action: () => void navigator.clipboard?.writeText(profile.email).catch(() => {}),
        };
      return { out: <>{bad} copy: only `copy email` is supported</>, sound: "error" };

    case "resume":
    case "cv":
      return { out: <>{ok} opening resume.pdf ↗</>, action: () => openExternal(profile.resume) };

    case "github":
    case "linkedin":
    case "journal":
      return {
        out: <>{ok} opening {cmd} ↗</>,
        action: () => openExternal(EXTERNAL[cmd]),
      };

    case "theme": {
      const next =
        argLower === "light" || argLower === "dark"
          ? argLower
          : env.theme === "dark"
            ? "light"
            : "dark";
      return {
        out: <>{ok} theme → {next}</>,
        action: () => {
          const rect = document.getElementById("terminal-input")?.getBoundingClientRect();
          switchTheme(next, rect ? { x: rect.left + 24, y: rect.top + rect.height / 2 } : undefined);
        },
      };
    }

    case "sound":
    case "sfx": {
      const wantOn = argLower === "on" ? true : argLower === "off" ? false : !env.soundOn;
      return {
        out: (
          <>
            {ok} ui sounds {wantOn ? "on — hover the tabs below" : "off"}
          </>
        ),
        action: () => {
          if (wantOn !== env.soundOn) env.toggleSound();
        },
      };
    }

    case "clear":
    case "cls":
      return { out: null, clear: true };

    case "history":
      return {
        out: env.history.length
          ? env.history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n")
          : "no history yet",
      };

    case "date": {
      const now = new Date();
      return {
        out: (
          <>
            {formatTime(now, profile.timezone)} ist · {profile.city.toLowerCase()}
            {"\n"}
            <span className="o-c">{formatTime(now)} · your time</span>
          </>
        ),
      };
    }

    case "echo":
      return { out: arg };

    case "pwd":
      return { out: "/home/visitor/nisanth" };

    case "sudo":
      if (argLower.startsWith("hire"))
        return {
          out: (
            <>
              [sudo] password for visitor: ••••••••{"\n"}
              {ok} permission granted — opening your mail client…
            </>
          ),
          sound: "success",
          action: () => {
            window.location.href = profile.emailLink;
          },
        };
      return {
        out: (
          <>
            visitor is not in the sudoers file. this incident will be reported.{"\n"}
            <span className="o-c">(try: sudo hire nisanth)</span>
          </>
        ),
        sound: "error",
      };

    case "rm":
      return { out: <>{bad} rm: permission denied — this portfolio is append-only</>, sound: "error" };

    case "vim":
    case "vi":
    case "nano":
    case "emacs":
      return { out: <>{bad} {cmd}: not installed. (you can&apos;t exit vim here either)</>, sound: "error" };

    case "git":
      return { out: <>git log lives in the journey section — press J, or scroll down</> };

    case "exit":
    case "logout":
      return { out: <>there&apos;s no exit — only `contact`</> };

    case "hi":
    case "hello":
    case "hey":
      return { out: <>hey there. try `help` — or `contact` if you want to talk</> };

    case "":
      return { out: null };

    default: {
      const names = [...HELP.map(([n]) => n), "open", "ls", "cat", "github", "linkedin", "date"];
      const best = names
        .map((n) => ({ n, d: levenshtein(cmd, n) }))
        .sort((a, b) => a.d - b.d)[0];
      return {
        out: (
          <>
            {bad} command not found: {head}
            {best && best.d <= 2 ? (
              <>
                {" "}
                — did you mean <span className="o-k">{best.n}</span>?
              </>
            ) : (
              <span className="o-c"> — try help</span>
            )}
          </>
        ),
        sound: "error",
      };
    }
  }
}

export const MOTD: Block = {
  id: 0,
  out: (
    <>
      <span className="o-s">●</span> connected to <span className="o-b">{DIR}</span>
      <span className="o-c"> · type </span>
      <span className="o-k">help</span>
      <span className="o-c">, or tap a command below</span>
    </>
  ),
};