import { TitleAlignment } from "~/modules/metrics/reducer";
import { memo } from "react";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Point } from "./geometry";
import { Icon } from "./Icon";
import { formatResult, nodeDisplay } from "~/lib/nodeDisplay";
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
  automaticAlignment = "center-center",
}: {
  metric: FullDenormalizedMetric;
  position: Point;
  selected: boolean;
  referenceMode: boolean;
  onSelect(): void;
  onMove(position: Point): void;
  surface?: "canvas" | "sheet";
  simplified?: boolean;
  automaticAlignment?: TitleAlignment;
}) {
  const { name, hasValue, heading, note, formula } = nodeDisplay(metric);
  const kind = heading
    ? "Heading"
    : note
    ? "Note"
    : formula
    ? "Formula"
    : "Input";
  const alignment = metric.titleAlignment?.[surface] || automaticAlignment;
  const [vertical, horizontal] = alignment.split("-");
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
        style={
          heading
            ? {
                justifyContent:
                  vertical === "top"
                    ? "flex-start"
                    : vertical === "bottom"
                    ? "flex-end"
                    : "center",
                textAlign: horizontal as "left" | "center" | "right",
              }
            : undefined
        }
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
        <NodeContents metric={metric} simplified={simplified} />
      </button>
    </article>
  );
}

const NodeContents = memo(function NodeContents({
  metric,
  simplified,
}: {
  metric: FullDenormalizedMetric;
  simplified: boolean;
}) {
  const stats = metric.simulation?.stats;
  const error = !!metric.simulation?.sample.errors?.length;
  const { name, empty, note, heading } = nodeDisplay(metric);

  return (
    <>
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
          {(!simplified || metric.guesstimate.guesstimateType !== "POINT") && (
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
              {formatResult(stats.mean)}
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
    </>
  );
});
