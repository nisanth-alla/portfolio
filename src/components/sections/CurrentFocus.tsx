import { Fragment, type CSSProperties } from "react";

import { Section, SectionHead } from "@/components/ui/Section";
import { Ticker } from "@/components/ui/Ticker";
import { focusLayers } from "@/content/focus";
import { projects } from "@/content/projects";
import { journalPageCount } from "@/content/writing";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** This site's own component tree, flashing like React DevTools' "highlight updates". */
function RenderTree() {
  const tree: Array<[number, string]> = [
    [0, "<App>"],
    [1, "<Hero>"],
    [2, "<Terminal />"],
    [1, "<Projects>"],
    [2, "<FeatureTabs />"],
    [1, "<GitHubActivity />"],
  ];
  return (
    <div className="w-tree" aria-hidden>
      {tree.map(([depth, node], i) => (
        <div key={node} style={{ ...idx(i), marginLeft: depth * 16 }}>
          {node}
        </div>
      ))}
    </div>
  );
}

/** A request walking an Express-style middleware chain. */
function Middleware() {
  const stages = ["req", "rateLimit", "auth", "handler", "200 OK"];
  return (
    <div aria-hidden>
      <pre className="w-log term-scope">
        <span className="o-c">$ curl -i localhost:8002/api/resource</span>
        {"\n"}
        <span className="o-e">HTTP/1.1 429 Too Many Requests</span>
        {"\n"}
        <span className="o-k">Retry-After</span>: 1{"\n"}
        <span className="o-k">X-RateLimit-Remaining</span>: 0
      </pre>
      <div className="w-flow">
      {stages.map((stage, i) => (
        <Fragment key={stage}>
          {i > 0 ? <b>→</b> : null}
          <span style={idx(i)}>{stage}</span>
        </Fragment>
      ))}
      </div>
    </div>
  );
}

/** The order-pipeline saga from the lab: shipping fails, earlier stages compensate. */
function Saga() {
  return (
    <div aria-hidden>
      <div className="w-flow w-saga">
        <span className="pay">pay</span>
        <b>→</b>
        <span className="stock">stock</span>
        <b>→</b>
        <span className="ship">ship ✗</span>
        <b>→</b>
        <span className="notify">notify</span>
      </div>
      <p className="m-0 mt-3 font-mono text-[11px] text-faint">ship fails → release stock → refund</p>
    </div>
  );
}

/** FoxPilot's docker compose services. */
function Services() {
  const services: Array<[string, string, boolean]> = [
    ["postgres:17", "healthy", true],
    ["api · uvicorn", "healthy", true],
    ["web · nginx", "healthy", true],
    ["ollama", "profile", false],
  ];
  return (
    <div aria-hidden>
      <p className="m-0 mb-2 font-mono text-[11px] text-faint">$ docker compose ps</p>
      <div className="w-svc">
        {services.map(([name, state, on], i) => (
          <div key={name}>
            <span>{name}</span>
            <span className="flex items-center gap-2 text-[10.5px] text-faint">
              {state}
              <i className={on ? undefined : "off"} style={idx(i)} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Proof() {
  const numbers = [
    { value: String(journalPageCount), label: "journal pages" },
    { value: "20", label: "live demos" },
    { value: String(projects.length), label: "projects" },
  ];
  return (
    <div className="w-proof">
      {numbers.map((n) => (
        <div key={n.label}>
          <b>
            <Ticker value={n.value} />
          </b>
          <span className="w-proof-label">{n.label}</span>
        </div>
      ))}
    </div>
  );
}

const WIDGETS = [RenderTree, Middleware, Saga, Services, Proof];

export function CurrentFocus() {
  return (
    <Section id="now">
      <SectionHead
        id="now"
        title="Current focus"
        lede="What I work with every day, and what I'm learning next."
      />
      <ul className="bento m-0 list-none p-0" data-reveal-item style={idx(1)}>
        {focusLayers.map((layer, i) => {
          const Widget = WIDGETS[i] ?? Proof;
          return (
            <li key={layer.title} className="tile spot">
              <div className="flex items-center justify-between gap-3">
                <span className="label">Focus {String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-wrap justify-end gap-1.5">
                  {layer.chips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </span>
              </div>
              <h3 className="tile-title m-0">{layer.title}</h3>
              <p className="tile-desc m-0">{layer.description}</p>
              <div className="tile-widget">
                <Widget />
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}