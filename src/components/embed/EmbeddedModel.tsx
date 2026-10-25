import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Modal from "react-modal";
import { denormalizedSpaceSelector } from "~/components/spaces/denormalized-space-selector";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { Icon } from "~/components/workspace/Icon";
import { loadWorkspaceModel } from "~/components/workspace/modelActions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import {
  frameComposition,
  arrangeComposition,
  embedConnectionPath,
  EMBED_NODE_WIDTH,
} from "./layout";
import styles from "./embed.module.css";
import { useEmbedSelection } from "./useEmbedSelection";

const number = (value: number | undefined) =>
  value === undefined || !Number.isFinite(value)
    ? "—"
    : new Intl.NumberFormat("en", { maximumSignificantDigits: 4 }).format(
        value
      );

export function EmbeddedModel({
  spaceId,
  token,
}: {
  spaceId: number;
  token: string | null;
}) {
  const dispatch = useAppDispatch();
  const { denormalizedSpace: space } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId })
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [attempt, setAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const markerId = `embed-arrow-${useId().replace(/:/g, "")}`;
  useEffect(() => {
    let active = true;
    setStatus("loading");
    dispatch(loadWorkspaceModel(spaceId, token))
      .then(() => {
        if (active) setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [dispatch, spaceId, token, attempt]);
  const measure = useCallback(() => {
    if (frame.current)
      setSize({
        width: frame.current.clientWidth,
        height: frame.current.clientHeight,
      });
  }, []);
  useEffect(() => {
    if (!frame.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(frame.current);
    measure();
    return () => observer.disconnect();
  }, [measure]);
  const metrics = space.metrics || [];
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({});
  const nodeIds = metrics.map((metric) => metric.id).join(",");
  useLayoutEffect(() => {
    if (status !== "ready" || !frame.current || !size.width) return;
    const nodes = [
      ...frame.current.querySelectorAll<HTMLButtonElement>("[data-embed-node]"),
    ];
    const measureNodes = () => {
      const next = Object.fromEntries(
        nodes.map((node) => [
          node.dataset.embedNode!,
          (node.querySelector<HTMLElement>("[data-embed-content]")
            ?.offsetHeight || 108) + 2,
        ])
      );
      setNodeHeights((previous) =>
        Object.keys(next).length === Object.keys(previous).length &&
        Object.entries(next).every(([id, height]) => previous[id] === height)
          ? previous
          : next
      );
    };
    const observer = new ResizeObserver(measureNodes);
    nodes.forEach((node) => {
      const content = node.querySelector<HTMLElement>("[data-embed-content]");
      if (content) observer.observe(content);
    });
    measureNodes();
    return () => observer.disconnect();
  }, [status, nodeIds, size.width]);
  const basePositions = arrangeComposition(metrics, nodeHeights);
  const view = frameComposition(
    [...basePositions.values()],
    size.width,
    size.height
  );
  const interaction = useEmbedSelection(basePositions, view);
  const positions = new Map(
    [...basePositions].map(([id, position]) => [
      id,
      {
        ...position,
        x: position.x + (interaction.offsets[id]?.x || 0),
        y: position.y + (interaction.offsets[id]?.y || 0),
      },
    ])
  );
  const surfaceWidth = Math.max(
    view.width,
    ...[...positions.values()].map(
      (p) => view.x + (p.x + EMBED_NODE_WIDTH) * view.zoom + 20
    )
  );
  const surfaceHeight = Math.max(
    view.height,
    ...[...positions.values()].map(
      (p) => view.y + (p.y + p.height) * view.zoom + 20
    )
  );
  const selected = metrics.find((metric) => metric.id === selectedId);
  const modelUrl = `/models/${spaceId}${
    token ? `?token=${encodeURIComponent(token)}` : ""
  }`;
  const ready = status === "ready";
  return (
    <main
      className={styles.embed}
      data-embed-ready={ready && size.width > 0 ? "true" : "false"}
    >
      <Head>
        <title>
          {space.name ? `${space.name} | Guesstimate` : "Guesstimate model"}
        </title>
      </Head>
      <header className={styles.header}>
        <h1>{ready ? space.name || "Untitled model" : "Guesstimate"}</h1>
        <a
          href={modelUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open full model"
          title="Open full model"
        >
          <Icon name="expand" />
        </a>
      </header>
      <div
        ref={frame}
        className={`${styles.frame} ${
          interaction.panning ? styles.panning : ""
        }`}
        aria-label="Model composition"
        {...interaction.handlers}
        onKeyDown={(event) => {
          if (event.key === "Escape") interaction.clear();
        }}
      >
        {status === "loading" && (
          <p className={styles.message} role="status">
            Loading model…
          </p>
        )}
        {status === "error" && (
          <div className={styles.message} role="alert">
            <p>Model couldn’t be loaded.</p>
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        )}
        {ready && !metrics.length && (
          <p className={styles.message}>This model is empty.</p>
        )}
        {ready && metrics.length > 0 && size.width > 0 && (
          <div
            className={styles.surface}
            data-embed-surface
            style={{ width: surfaceWidth, height: surfaceHeight }}
          >
            <div
              className={styles.composition}
              style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
              }}
            >
              <svg className={styles.connections} aria-hidden="true">
                <defs>
                  <marker
                    id={markerId}
                    viewBox="0 0 8 8"
                    refX="7"
                    refY="4"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M1 1L7 4L1 7" fill="none" stroke="var(--edge)" />
                  </marker>
                </defs>
                {(space.edges || []).map((edge) => {
                  const from = positions.get(edge.input),
                    to = positions.get(edge.output);
                  return from && to ? (
                    <path
                      key={`${edge.input}-${edge.output}`}
                      d={embedConnectionPath(from, to)}
                      markerEnd={`url(#${markerId})`}
                    />
                  ) : null;
                })}
              </svg>
              {metrics.map((metric) => {
                const position = positions.get(metric.id)!;
                const name = metric.name?.trim();
                const notes = metric.guesstimate.description?.trim();
                const hasValue =
                  !!metric.guesstimate.input?.trim() ||
                  !!metric.guesstimate.data?.length;
                const heading =
                  !hasValue &&
                  !!name &&
                  (!notes || metric.showNotesOnNode === false);
                const stats = metric.simulation?.stats;
                const error = !!metric.simulation?.sample.errors?.length;
                return (
                  <button
                    key={metric.id}
                    type="button"
                    data-embed-node={metric.id}
                    aria-pressed={interaction.selection.includes(metric.id)}
                    className={`${styles.node} ${
                      metric.edges.inputs.length ? styles.calculated : ""
                    } ${
                      interaction.selection.includes(metric.id)
                        ? styles.selected
                        : ""
                    } ${
                      heading ? styles.heading : !hasValue ? styles.note : ""
                    }`}
                    style={{
                      left: position.x,
                      top: position.y,
                      width: EMBED_NODE_WIDTH,
                      height: position.height,
                    }}
                    onClick={(event) => {
                      if (
                        (event.target as HTMLElement).closest(
                          "[data-embed-corner]"
                        )
                      )
                        return;
                      if (event.shiftKey) interaction.select(metric.id, true);
                      else if (interaction.canOpen()) setSelectedId(metric.id);
                    }}
                    aria-label={`View ${name || metric.readableId}`}
                  >
                    <span
                      className={styles.corner}
                      data-embed-corner
                      aria-hidden="true"
                    >
                      <Icon name="grip" />
                    </span>
                    <span className={styles.nodeBody} data-embed-content>
                      <span className={styles.nodeHeader}>
                        {(name || (!hasValue && !notes)) && (
                          <span className={styles.name}>
                            {name || "Untitled node"}
                          </span>
                        )}
                        {hasValue && (
                          <span className={styles.reference}>
                            {metric.readableId}
                          </span>
                        )}
                      </span>
                      {!heading && !hasValue && notes && (
                        <span className={styles.notes}>{notes}</span>
                      )}
                      {hasValue && (
                        <>
                          {metric.guesstimate.guesstimateType !== "POINT" && (
                            <span className={styles.expression}>
                              {metric.guesstimate.input ||
                                `${metric.guesstimate.data?.length} data points`}
                            </span>
                          )}
                          {error ? (
                            <span className={styles.error}>
                              Calculation error
                            </span>
                          ) : stats ? (
                            <span className={styles.result}>
                              <span className={styles.value}>
                                {number(stats.mean)}
                                <small>{stats.length > 1 ? "mean" : ""}</small>
                              </span>
                              {stats.length > 1 && (
                                <span className={styles.histogram}>
                                  <SimulationHistogram
                                    simulation={metric.simulation}
                                    cutOffRatio={0.995}
                                    theme="normal"
                                  />
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className={styles.pending}>Calculating…</span>
                          )}
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
              {interaction.marquee && (
                <span
                  className={styles.marquee}
                  style={{
                    left: interaction.marquee.x,
                    top: interaction.marquee.y,
                    width: interaction.marquee.width,
                    height: interaction.marquee.height,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        <a href={modelUrl} target="_blank" rel="noopener noreferrer">
          Guesstimate
        </a>
      </footer>
      <Modal
        isOpen={!!selected}
        onRequestClose={() => setSelectedId(null)}
        onAfterOpen={() => close.current?.focus()}
        appElement={
          typeof document !== "undefined"
            ? document.getElementById("__next") || undefined
            : undefined
        }
        className={styles.dialog}
        overlayClassName={styles.overlay}
        aria={{ labelledby: "embed-node-title" }}
      >
        {selected && (
          <>
            <div className={styles.dialogHeader}>
              <h2 id="embed-node-title">
                {selected.name || selected.readableId}
              </h2>
              <button
                ref={close}
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close node details"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className={styles.details}>
              {!!selected.guesstimate.input && (
                <div>
                  <h3>
                    {selected.guesstimate.guesstimateType === "FUNCTION"
                      ? "Formula"
                      : "Value"}
                  </h3>
                  <p className={styles.fullExpression}>
                    {selected.guesstimate.input}
                  </p>
                </div>
              )}
              {!!selected.guesstimate.description && (
                <div>
                  <h3>Notes</h3>
                  <p className={styles.fullNotes}>
                    {selected.guesstimate.description}
                  </p>
                </div>
              )}
              {selected.simulation?.sample.errors?.length ? (
                <p role="status" className={styles.error}>
                  Calculation error
                </p>
              ) : selected.simulation?.stats &&
                (selected.guesstimate.input ||
                  selected.guesstimate.data?.length) ? (
                <>
                  <dl className={styles.stats}>
                    <div>
                      <dt>
                        {selected.simulation.stats.length > 1
                          ? "Mean"
                          : "Result"}
                      </dt>
                      <dd>{number(selected.simulation.stats.mean)}</dd>
                    </div>
                    {selected.simulation.stats.length > 1 &&
                      selected.simulation.stats.percentiles && (
                        <>
                          <div>
                            <dt>5th percentile</dt>
                            <dd>
                              {number(selected.simulation.stats.percentiles[5])}
                            </dd>
                          </div>
                          <div>
                            <dt>95th percentile</dt>
                            <dd>
                              {number(
                                selected.simulation.stats.percentiles[95]
                              )}
                            </dd>
                          </div>
                        </>
                      )}
                  </dl>
                  {selected.simulation.stats.length > 1 && (
                    <div className={styles.detailChart}>
                      <SimulationHistogram
                        simulation={selected.simulation}
                        cutOffRatio={0.995}
                        theme="normal"
                        showTicks
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </>
        )}
      </Modal>
    </main>
  );
}
