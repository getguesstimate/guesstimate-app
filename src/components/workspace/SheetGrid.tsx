import { hasNodeValue } from "~/lib/nodeDisplay";
import { memo, useMemo } from "react";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { CanvasLocation } from "~/lib/locationUtils";
import { CanvasNode } from "./CanvasNode";
import { automaticTitleAlignment } from "./titleAlignment";
import { Icon } from "./Icon";
import { connectionPath } from "./geometry";
import { cellName, sameCell, sheetPoint, SHEET_INSET } from "./sheetGeometry";
import styles from "./workspace.module.css";

type Props = {
  metrics: FullDenormalizedMetric[];
  edges: { input: string; output: string }[];
  rowCount: number;
  columnCount: number;
  cell: CanvasLocation;
  rangeEnd: CanvasLocation | null;
  selectedId: string | null;
  drag: { id: string; target: CanvasLocation } | null;
  simplified: boolean;
  referenceMode: boolean;
  loading: boolean;
  error: boolean;
  selectCell(location: CanvasLocation): void;
  move(id: string, location: CanvasLocation): void;
  onAdd(location: CanvasLocation): void;
};

// Zoom and scroll are owned by the outer sheet; neither changes grid content.
export const SheetGrid = memo(function SheetGrid(props: Props) {
  const {
    metrics,
    rowCount,
    columnCount,
    cell,
    rangeEnd,
    selectedId,
    drag,
    simplified,
    referenceMode,
    selectCell,
    move,
  } = props;
  const metricsById = useMemo(
    () => new Map(metrics.map((m) => [m.id, m])),
    [metrics]
  );
  const metricsByCell = useMemo(() => {
    const result = new Map<string, FullDenormalizedMetric>();
    for (const m of metrics) {
      const key = `${m.location.row}:${m.location.column}`;
      if (!result.has(key)) result.set(key, m);
    }
    return result;
  }, [metrics]);
  const at = (location: CanvasLocation) =>
    metricsByCell.get(`${location.row}:${location.column}`);
  const inRange = (location: CanvasLocation) =>
    !!rangeEnd &&
    location.row >= Math.min(cell.row, rangeEnd.row) &&
    location.row <= Math.max(cell.row, rangeEnd.row) &&
    location.column >= Math.min(cell.column, rangeEnd.column) &&
    location.column <= Math.max(cell.column, rangeEnd.column);
  const rangeNodes = metrics.filter((m) =>
    rangeEnd ? inRange(m.location) : m.id === selectedId
  );
  return (
    <>
      {Array.from({ length: rowCount }, (_, row) => (
        <div className={styles.sheetRow} role="row" key={row}>
          <div className={styles.sheetSemanticRowHeading} role="rowheader">
            {row + 1}
          </div>
          {Array.from({ length: columnCount }, (_, column) => {
            const location = { row, column },
              metric = at(location);
            const dragged = drag && metrics.find((m) => m.id === drag.id);
            const movingGroup = !!(
              dragged &&
              rangeEnd &&
              inRange(dragged.location) &&
              rangeNodes.length > 1
            );
            const target =
              drag &&
              (movingGroup
                ? rangeNodes.some((m) =>
                    sameCell(
                      {
                        row:
                          m.location.row +
                          drag.target.row -
                          dragged!.location.row,
                        column:
                          m.location.column +
                          drag.target.column -
                          dragged!.location.column,
                      },
                      location
                    )
                  )
                : sameCell(drag.target, location));
            return (
              <div
                key={column}
                role="gridcell"
                aria-label={cellName(location)}
                aria-selected={
                  rangeEnd ? inRange(location) : sameCell(cell, location)
                }
                data-sheet-cell={cellName(location)}
                className={`${styles.sheetCell} ${
                  inRange(location) ? styles.sheetRangeCell : ""
                } ${
                  target
                    ? metric &&
                      metric.id !== drag.id &&
                      !(
                        movingGroup &&
                        rangeNodes.some((m) => m.id === metric.id)
                      )
                      ? styles.sheetDropBlocked
                      : styles.sheetDropTarget
                    : ""
                }`}
              >
                {metric ? (
                  <CanvasNode
                    simplified={simplified}
                    metric={metric}
                    surface="sheet"
                    automaticAlignment={automaticTitleAlignment(
                      location,
                      (cell) => hasNodeValue(at(cell)?.guesstimate)
                    )}
                    position={SHEET_INSET}
                    selected={selectedId === metric.id || inRange(location)}
                    referenceMode={referenceMode}
                    onSelect={() => {
                      selectCell(location);
                    }}
                    onMove={(point) =>
                      move(metric.id, {
                        row: row + Math.sign(point.y - SHEET_INSET.y),
                        column: column + Math.sign(point.x - SHEET_INSET.x),
                      })
                    }
                  />
                ) : (
                  <button
                    type="button"
                    className={styles.emptySheetCell}
                    tabIndex={sameCell(cell, location) ? 0 : -1}
                    aria-label={`Empty cell ${cellName(location)}`}
                    disabled={props.loading || props.error}
                    onClick={() => selectCell(location)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        props.onAdd(location);
                      }
                    }}
                  >
                    <span>
                      <Icon name="plus" />
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <svg className={styles.sheetConnections} aria-hidden="true">
        <defs>
          <marker
            id="sheet-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M 1 1 L 7 4 L 1 7" />
          </marker>
        </defs>
        {props.edges.map((edge) => {
          const from = metricsById.get(edge.input),
            to = metricsById.get(edge.output);
          return from && to ? (
            <path
              key={`${edge.input}-${edge.output}`}
              data-sheet-edge
              d={connectionPath(
                sheetPoint(from.location),
                sheetPoint(to.location)
              )}
              markerEnd="url(#sheet-arrow)"
              className={
                selectedId === from.id || selectedId === to.id
                  ? styles.selectedEdge
                  : undefined
              }
            />
          ) : null;
        })}
      </svg>
    </>
  );
});
