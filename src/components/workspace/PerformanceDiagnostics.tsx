import { useEffect, useRef, useState } from "react";
import styles from "./workspace.module.css";

const selectors = {
  connections: `.${styles.connections}, .${styles.sheetConnections}`,
  charts: `.${styles.nodeChart}`,
};
type Mode = "baseline" | "connections" | "charts" | "effects";
type Bucket = {
  second: number;
  frames: number;
  maxFrameMs: number;
  events: Record<string, number>;
  mutations: Record<string, number>;
};
const round = (n: number) => Math.round(n * 100) / 100;

function snapshot(root: Element) {
  const bounds = (selector: string) =>
    Array.from(root.querySelectorAll(selector)).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        width: round(rect.width),
        height: round(rect.height),
        transform: getComputedStyle(el).transform,
      };
    });
  return {
    viewport: [innerWidth, innerHeight],
    dpr: devicePixelRatio,
    mountedNodes: root.querySelectorAll("[data-node], [data-sheet-node]")
      .length,
    domElements: root.querySelectorAll("*").length,
    connectionPaths: Array.from(
      root.querySelectorAll(selectors.connections)
    ).reduce((n, el) => n + el.querySelectorAll("path").length, 0),
    charts: root.querySelectorAll(selectors.charts).length,
    connectionBounds: bounds(selectors.connections),
    stages: bounds(`.${styles.stage}, .${styles.sheetStage}`),
    scroll: Array.from(root.querySelectorAll(`.${styles.sheetScroll}`)).map(
      (el) => [el.scrollLeft, el.scrollTop]
    ),
    appearance: root
      .querySelector("[data-node-appearance]")
      ?.getAttribute("data-node-appearance"),
  };
}

export default function PerformanceDiagnostics() {
  const [mode, setMode] = useState<Mode>("baseline");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState(
    "Record the same actions for each comparison (15 seconds)."
  );
  const [report, setReport] = useState("");
  const runs = useRef<unknown[]>([]);
  const stop = useRef<(() => void) | null>(null);
  useEffect(() => () => stop.current?.(), []);

  function start() {
    const root = document.querySelector(`.${styles.workspace}`);
    if (!root || stop.current) return;
    const initial = snapshot(root);
    const started = performance.now();
    const buckets: Bucket[] = [];
    const frames: number[] = [];
    const longEntries: {
      type: string;
      startMs: number;
      durationMs: number;
      blockingDuration?: number;
    }[] = [];
    let hidden = document.hidden;
    let observerMs = 0;
    const bucket = () => {
      const second = Math.floor((performance.now() - started) / 1000);
      return (buckets[second] ||= {
        second,
        frames: 0,
        maxFrameMs: 0,
        events: {},
        mutations: {},
      });
    };
    const event = (e: Event) => {
      const counts = bucket().events;
      const name =
        e.type === "wheel" && (e as WheelEvent).ctrlKey ? "ctrl+wheel" : e.type;
      counts[name] = (counts[name] || 0) + 1;
    };
    const eventNames = [
      "pointermove",
      "pointerdown",
      "pointerup",
      "wheel",
      "scroll",
      "keydown",
    ];
    eventNames.forEach((name) =>
      root.addEventListener(name, event, { capture: true, passive: true })
    );
    const visibility = () => {
      hidden ||= document.hidden;
    };
    document.addEventListener("visibilitychange", visibility);
    const mutations = new MutationObserver((records) => {
      const before = performance.now();
      const counts = bucket().mutations;
      for (const record of records) {
        const target =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement;
        const area = target?.closest(selectors.connections)
          ? "connections"
          : target?.closest(selectors.charts)
          ? "charts"
          : "other";
        const key = `${area}:${
          record.type === "attributes" ? record.attributeName : record.type
        }`;
        counts[key] = (counts[key] || 0) + 1;
      }
      observerMs += performance.now() - before;
    });
    mutations.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
      attributeFilter: ["style", "class", "d", "transform", "width", "height"],
    });
    const observers: PerformanceObserver[] = [];
    const supported = PerformanceObserver.supportedEntryTypes || [];
    for (const type of ["longtask", "long-animation-frame"]) {
      if (!supported.includes(type)) continue;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime < started || longEntries.length >= 500) continue;
          longEntries.push({
            type,
            startMs: round(entry.startTime - started),
            durationMs: round(entry.duration),
            blockingDuration: (
              entry as PerformanceEntry & { blockingDuration?: number }
            ).blockingDuration,
          });
        }
      });
      observer.observe({ type });
      observers.push(observer);
    }
    let previous = started;
    let raf = 0;
    const frame = (now: number) => {
      const delta = now - previous;
      previous = now;
      frames.push(delta);
      const b = bucket();
      b.frames++;
      b.maxFrameMs = Math.max(b.maxFrameMs, round(delta));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    performance.mark("guesstimate-diagnostic-start");
    const finish = () => {
      if (!stop.current) return;
      stop.current = null;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      mutations.disconnect();
      observers.forEach((o) => o.disconnect());
      eventNames.forEach((name) => root.removeEventListener(name, event, true));
      document.removeEventListener("visibilitychange", visibility);
      performance.mark("guesstimate-diagnostic-end");
      const sorted = [...frames].sort((a, b) => a - b);
      const percentile = (p: number) =>
        round(
          sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] ||
            0
        );
      runs.current.push({
        mode,
        elapsedMs: round(performance.now() - started),
        hiddenDuringRun: hidden,
        initial,
        final: snapshot(root),
        frames: {
          count: frames.length,
          p50Ms: percentile(0.5),
          p95Ms: percentile(0.95),
          maxMs: percentile(1),
          over50Ms: frames.filter((n) => n > 50).length,
        },
        buckets,
        longEntries,
        mutationObserverMs: round(observerMs),
      });
      setReport(
        JSON.stringify(
          {
            version: 1,
            browser: navigator.userAgent,
            supportedEntries: supported,
            limits:
              "RAF intervals measure callback cadence, not presented FPS or GPU time. DOM mutations are not paint counts. Bounds read only at start/end. Hidden-tab runs are invalid. No model text or formulas collected.",
            runs: runs.current,
          },
          null,
          2
        )
      );
      setRunning(false);
      setStatus(
        `Saved ${runs.current.length} run(s). Choose a comparison or copy the report.`
      );
    };
    const timer = setTimeout(finish, 15000);
    stop.current = finish;
    setRunning(true);
    setStatus("Recording for 15 seconds—perform the laggy actions.");
  }

  const css =
    mode === "baseline"
      ? ""
      : mode === "effects"
      ? `.${styles.workspace} * { box-shadow:none!important; filter:none!important; backdrop-filter:none!important; transition:none!important; animation:none!important; }`
      : `${selectors[mode]} { visibility:hidden!important; }`;
  return (
    <aside
      aria-label="Performance diagnostics"
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 10000,
        width: 340,
        maxWidth: "calc(100vw - 24px)",
        padding: 12,
        background: "#fff",
        color: "#172b40",
        border: "1px solid #64748b",
        borderRadius: 8,
        font: "13px system-ui",
      }}
    >
      <style>{css}</style>
      <strong>Performance diagnostics</strong>
      <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        <select
          aria-label="Rendering comparison"
          value={mode}
          disabled={running}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          <option value="baseline">Baseline</option>
          <option value="connections">Hide connections</option>
          <option value="charts">Hide charts</option>
          <option value="effects">Disable effects</option>
        </select>
        <button onClick={running ? () => stop.current?.() : start}>
          {running ? "Stop" : "Record"}
        </button>
        <button
          disabled={!report || running}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(report);
              setStatus("Report copied.");
            } catch {
              setStatus("Select and copy the report below.");
            }
          }}
        >
          Copy
        </button>
      </div>
      <div role="status">{status}</div>
      {report && !running && (
        <details>
          <summary>Report</summary>
          <textarea
            aria-label="Diagnostic report"
            readOnly
            value={report}
            style={{ width: "100%", height: 100 }}
          />
        </details>
      )}
    </aside>
  );
}
