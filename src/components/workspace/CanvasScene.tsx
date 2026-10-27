import { useMemo } from "react";
import type { FullDenormalizedMetric } from "~/lib/engine/space";
import { hasNodeValue } from "~/lib/nodeDisplay";
import { CanvasNode } from "./CanvasNode";
import { automaticTitleAlignment } from "./titleAlignment";
import { connectionPath, type Point } from "./geometry";
import styles from "./workspace.module.css";

type Props = {
  metrics: FullDenormalizedMetric[];
  edges: { input: string; output: string }[];
  selectedId: string | null;
  activeSelection: string[];
  simplified: boolean;
  referenceMode: boolean;
  positionOf(metric: FullDenormalizedMetric): Point;
  onSelect(id: string): void;
  onMove(id: string, point: Point): void;
};
export function CanvasScene({
  metrics,
  edges,
  selectedId,
  activeSelection,
  simplified,
  referenceMode,
  positionOf,
  onSelect,
  onMove,
}: Props) {
  const metricsById = useMemo(
    () => new Map(metrics.map((m) => [m.id, m])),
    [metrics]
  );
  const selectedIds = new Set(activeSelection);
  const canvasTitleAlignments = useMemo(() => {
    const occupied = new Set(
      metrics
        .filter((m) => hasNodeValue(m.guesstimate))
        .map((m) => `${m.location.row}:${m.location.column}`)
    );
    return new Map(
      metrics.map((m) => [
        m.id,
        m.canvasPosition
          ? ("center-center" as const)
          : m.titleAlignment?.sheet ||
            automaticTitleAlignment(m.location, (cell) =>
              occupied.has(`${cell.row}:${cell.column}`)
            ),
      ])
    );
  }, [metrics]);
  return (
    <>
      <svg className={styles.connections} aria-hidden="true">
        <defs>
          <marker
            id="workspace-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M 1 1 L 7 4 L 1 7" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = metricsById.get(edge.input),
            to = metricsById.get(edge.output);
          if (!from || !to) return null;
          return (
            <path
              key={`${edge.input}-${edge.output}`}
              data-edge={`${edge.input}-${edge.output}`}
              className={
                selectedId === edge.input || selectedId === edge.output
                  ? styles.selectedEdge
                  : undefined
              }
              d={connectionPath(positionOf(from), positionOf(to))}
              markerEnd="url(#workspace-arrow)"
            />
          );
        })}
      </svg>
      {metrics.map((metric) => (
        <CanvasNode
          simplified={simplified}
          key={metric.id}
          metric={metric}
          automaticAlignment={canvasTitleAlignments.get(metric.id)}
          selected={selectedId === metric.id || selectedIds.has(metric.id)}
          referenceMode={referenceMode}
          position={positionOf(metric)}
          onSelect={() => onSelect(metric.id)}
          onMove={(point) => onMove(metric.id, point)}
        />
      ))}
    </>
  );
}
