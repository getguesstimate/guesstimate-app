import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Point } from "./geometry";
import { Icon } from "./Icon";
import { formatNumber } from "./NodeInspector";
import styles from "./workspace.module.css";

export function CanvasNode({
  metric,
  position,
  selected,
  referenceMode,
  onSelect,
  onMove,
  surface = "canvas",
  simplified = false,
}: {
  metric: FullDenormalizedMetric;
  position: Point;
  selected: boolean;
  referenceMode: boolean;
  onSelect(): void;
  onMove(position: Point): void;
  surface?: "canvas" | "sheet";
  simplified?: boolean;
}) {
  const stats = metric.simulation?.stats;
  const error = !!metric.simulation?.sample.errors?.length;
  const formula = metric.guesstimate.guesstimateType === "FUNCTION";
  const name = metric.name?.trim();
  const description = metric.guesstimate.description?.trim();
  const hasValue =
    !!metric.guesstimate.input?.trim() || !!metric.guesstimate.data?.length;
  const empty = !name && !description && !hasValue;
  const note = !hasValue && !!(name || description);
  const heading =
    note && !!name && (!description || metric.showNotesOnNode === false);
  const kind = heading
    ? "Heading"
    : note
    ? "Note"
    : formula
    ? "Formula"
    : "Input";
  return (
    <article
      data-node-appearance={simplified ? "simplified" : "standard"}
      className={`${styles.node} ${simplified ? styles.simplifiedNode : ""} ${
        metric.edges.inputs.length ? styles.calculatedNode : ""
      } ${selected ? styles.selectedNode : ""} ${
        heading ? styles.headingNode : formula ? styles.formulaNode : ""
      }`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      data-node={surface === "canvas" ? metric.id : undefined}
      data-sheet-node={surface === "sheet" ? metric.id : undefined}
      aria-label={metric.name || `Node ${metric.readableId}`}
    >
      <div
        className={styles.nodeTop}
        data-drag-node={metric.id}
        title={
          simplified ? "Drag top-right corner to move" : "Drag header to move"
        }
      >
        <span>{kind}</span>
        {(!simplified || hasValue) && <code>{metric.readableId}</code>}
        <button
          type="button"
          className={styles.dragHandle}
          aria-label={`Move ${metric.name || metric.readableId}`}
          title={
            surface === "sheet"
              ? "Drag to move · Arrow keys to move one cell"
              : "Drag to move · Arrow keys to nudge"
          }
          onKeyDown={(event) => {
            const directions: Record<string, Point> = {
              ArrowLeft: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              ArrowUp: { x: 0, y: -1 },
              ArrowDown: { x: 0, y: 1 },
            };
            const direction = directions[event.key];
            if (direction) {
              event.preventDefault();
              event.stopPropagation();
              const step = event.shiftKey ? 40 : 10;
              onMove({
                x: position.x + direction.x * step,
                y: position.y + direction.y * step,
              });
            }
          }}
        >
          <Icon name="grip" />
        </button>
      </div>
      <button
        type="button"
        className={styles.nodeContent}
        aria-pressed={selected}
        onPointerDown={(event) => {
          if (referenceMode) {
            event.preventDefault();
            event.stopPropagation();
            onSelect();
          }
        }}
        onClick={(event) => {
          if (!referenceMode || event.detail === 0) onSelect();
        }}
        aria-label={`Edit ${metric.name || metric.readableId}`}
      >
        {(name || empty) && (
          <span className={styles.nodeName}>{name || "Untitled node"}</span>
        )}
        {heading ? null : note ? (
          <span className={styles.notePreview}>
            {metric.guesstimate.description ||
              "Select to add a value or write a note."}
          </span>
        ) : (
          <>
            {(!simplified ||
              metric.guesstimate.guesstimateType !== "POINT") && (
              <code className={styles.nodeExpression}>
                {metric.guesstimate.input ||
                  (metric.guesstimate.data?.length
                    ? `${metric.guesstimate.data.length} data points`
                    : "Add a value or formula")}
              </code>
            )}
            {error ? (
              <span className={styles.nodeError}>Check this expression</span>
            ) : stats ? (
              <span className={styles.nodeResult}>
                {formatNumber(stats.mean)}
                <small>
                  {stats.length > 1 ? "mean" : simplified ? "" : "value"}
                </small>
              </span>
            ) : (
              <span className={styles.nodeEmpty}>
                {metric.guesstimate.input ? "Calculating…" : "No value yet"}
              </span>
            )}
            {stats?.length > 1 && (
              <div className={styles.nodeChart}>
                <SimulationHistogram
                  simulation={metric.simulation}
                  cutOffRatio={0.05}
                  bins={22}
                />
              </div>
            )}
          </>
        )}
      </button>
    </article>
  );
}
