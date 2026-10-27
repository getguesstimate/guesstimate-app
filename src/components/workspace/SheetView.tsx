import { SelectionActions } from "./SelectionActions";
import {
  useSheetViewport,
  SHEET_BASE_SCALE,
  MIN_SHEET_SCALE,
  MAX_SHEET_SCALE,
} from "./useSheetViewport";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { CanvasLocation } from "~/lib/locationUtils";
import { SheetGrid } from "./SheetGrid";
import { SheetToolbar } from "./SheetToolbar";
import { Icon } from "./Icon";
import {
  cellAtPoint,
  cellName,
  columnName,
  sameCell,
  SHEET_COLUMN,
  SHEET_ROW,
  SHEET_GUTTER,
  SHEET_HEADING,
} from "./sheetGeometry";
import styles from "./workspace.module.css";
import { useSimplifiedNodes } from "./useNodeAppearance";

type Props = {
  active: boolean;
  metrics: FullDenormalizedMetric[];
  edges: { input: string; output: string }[];
  selectedId: string | null;
  referenceMode: boolean;
  loading: boolean;
  error: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onSelect(id: string): void;
  onClear(): void;
  onAdd(location: CanvasLocation): void;
  onMove(id: string, location: CanvasLocation): void;
  onMoveNodes(ids: string[], delta: CanvasLocation): boolean;
  onDelete(): void;
  onDeleteNodes(ids: string[]): void;
  onDuplicateNodes(ids: string[]): CanvasLocation[];
  onUndo(): void;
  onRedo(): void;
  onRetry(): void;
  onDownload(): void;
};

function SheetViewComponent(props: Props) {
  const { active, metrics, selectedId, referenceMode } = props;
  const simplified = useSimplifiedNodes();
  const [cell, setCell] = useState<CanvasLocation>({ row: 0, column: 0 });
  const [rangeEnd, setRangeEnd] = useState<CanvasLocation | null>(null);
  const rangeDrag = useRef<{
    start: CanvasLocation;
    x: number;
    y: number;
    moved: boolean;
    previousCell: CanvasLocation;
    previousEnd: CanvasLocation | null;
  } | null>(null);
  const inRange = (location: CanvasLocation) =>
    !!rangeEnd &&
    location.row >= Math.min(cell.row, rangeEnd.row) &&
    location.row <= Math.max(cell.row, rangeEnd.row) &&
    location.column >= Math.min(cell.column, rangeEnd.column) &&
    location.column <= Math.max(cell.column, rangeEnd.column);
  const rangeNodes = metrics.filter((m) =>
    rangeEnd ? inRange(m.location) : m.id === selectedId
  );
  const selectRange = (start: CanvasLocation, end: CanvasLocation) => {
    setCell(start);
    setRangeEnd(end);
    props.onClear();
  };
  const deleteRange = () => {
    if (!rangeNodes.length) return;
    props.onDeleteNodes(rangeNodes.map((m) => m.id));
    setMessage(`Deleted ${rangeNodes.length} nodes. Undo restores them.`);
  };
  const [extent, setExtent] = useState({ rows: 8, columns: 6 });
  const [drag, setDrag] = useState<{
    id: string;
    target: CanvasLocation;
  } | null>(null);
  const dragRef = useRef<typeof drag>(null);
  const [message, setMessage] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const [hand, setHand] = useState(false);
  const [areaMode, setAreaMode] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pan = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    empty?: boolean;
  } | null>(null);
  const pinch = useRef<{
    distance: number;
    zoom: number;
    x: number;
    y: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const emptyPress = useRef<{
    pointerId: number;
    location: CanvasLocation;
    x: number;
    y: number;
  } | null>(null);
  const lastEmptyTap = useRef<{
    location: CanvasLocation;
    time: number;
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    const release = () => setSpaceHeld(false);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", release);
    };
  }, []);
  const rowCount = Math.max(
    extent.rows,
    ...metrics.map((m) => m.location.row + 3),
    cell.row + 2
  );
  const columnCount = Math.max(
    extent.columns,
    ...metrics.map((m) => m.location.column + 3),
    cell.column + 2
  );
  const handActive = hand || spaceHeld;
  const {
    scroll,
    zoom,
    zoomRef,
    zoomTo,
    pendingScroll,
    applyPendingScroll,
    columnHeadings,
    rowHeadings,
    corner,
    updatePinnedHeaders,
    fit,
  } = useSheetViewport(metrics, rowCount, handActive);

  const metricsByCell = useMemo(() => {
    const cells = new Map<string, FullDenormalizedMetric>();
    for (const metric of metrics) {
      const key = `${metric.location.row}:${metric.location.column}`;
      if (!cells.has(key)) cells.set(key, metric);
    }
    return cells;
  }, [metrics]);
  const at = (location: CanvasLocation) =>
    metricsByCell.get(`${location.row}:${location.column}`);
  const selectedLocation = metrics.find((m) => m.id === selectedId)?.location;
  const selectedRow = selectedLocation?.row;
  const selectedColumn = selectedLocation?.column;
  const reveal = useCallback(
    (location: CanvasLocation) => {
      const box = scroll.current;
      if (!box) return;
      const z = zoomRef.current;
      const left = (SHEET_GUTTER + location.column * SHEET_COLUMN) * z,
        top = (SHEET_HEADING + location.row * SHEET_ROW) * z;
      if (left < box.scrollLeft + SHEET_GUTTER * z)
        box.scrollLeft = left - SHEET_GUTTER * z;
      else if (left + SHEET_COLUMN * z > box.scrollLeft + box.clientWidth)
        box.scrollLeft = Math.max(0, left + SHEET_COLUMN * z - box.clientWidth);
      if (top < box.scrollTop + SHEET_HEADING * z)
        box.scrollTop = top - SHEET_HEADING * z;
      else if (top + SHEET_ROW * z > box.scrollTop + box.clientHeight)
        box.scrollTop = Math.max(0, top + SHEET_ROW * z - box.clientHeight);
    },
    [scroll, zoomRef]
  );
  useEffect(() => {
    if (!active || selectedRow === undefined || selectedColumn === undefined)
      return;
    const location = { row: selectedRow, column: selectedColumn };
    setCell(location);
    reveal(location);
  }, [active, selectedId, selectedRow, selectedColumn, reveal]);
  useEffect(() => {
    const box = scroll.current;
    if (!box) return;
    const observer = new ResizeObserver(() => {
      if (
        active &&
        selectedId &&
        selectedRow !== undefined &&
        selectedColumn !== undefined
      )
        reveal({ row: selectedRow, column: selectedColumn });
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [active, selectedId, selectedRow, selectedColumn, reveal, scroll]);
  const selectCell = (location: CanvasLocation, focus = false) => {
    setRangeEnd(null);
    setCell(location);
    const metric = at(location);
    if (metric) props.onSelect(metric.id);
    else props.onClear();
    if (focus)
      requestAnimationFrame(() => {
        reveal(location);
        const cellElement = stage.current?.querySelector(
          `[data-sheet-cell="${cellName(location)}"]`
        );
        const button =
          cellElement?.querySelector<HTMLButtonElement>(
            "button[aria-pressed]"
          ) || cellElement?.querySelector<HTMLButtonElement>("button");
        button?.focus({ preventScroll: true });
      });
  };
  const move = (id: string, location: CanvasLocation) => {
    const moving = metrics.find((m) => m.id === id);
    if (
      moving &&
      rangeEnd &&
      inRange(moving.location) &&
      rangeNodes.length > 1
    ) {
      const delta = {
        row: location.row - moving.location.row,
        column: location.column - moving.location.column,
      };
      if (!delta.row && !delta.column) return;
      if (
        !props.onMoveNodes(
          rangeNodes.map((m) => m.id),
          delta
        )
      ) {
        setMessage(
          "Cannot move the group here: a cell is occupied or outside the sheet."
        );
        return;
      }
      const translate = (p: CanvasLocation) => ({
        row: p.row + delta.row,
        column: p.column + delta.column,
      });
      selectRange(translate(cell), translate(rangeEnd));
      setMessage(`Moved ${rangeNodes.length} nodes.`);
      return;
    }
    if (location.row < 0 || location.column < 0) return;
    const occupied = at(location);
    if (occupied && occupied.id !== id) {
      setMessage(`${cellName(location)} already contains a node.`);
      return;
    }
    const metric = metrics.find((m) => m.id === id);
    if (!metric || sameCell(metric.location, location)) return;
    setRangeEnd(null);
    props.onMove(id, location);
    if (!referenceMode) props.onSelect(id);
    setCell(location);
    setMessage(
      `Moved ${metric.name || metric.readableId} to ${cellName(location)}.`
    );
  };
  const gridActions = useRef({ selectCell, move });
  useLayoutEffect(() => {
    gridActions.current = { selectCell, move };
  });
  const gridSelectCell = useCallback(
    (location: CanvasLocation) => gridActions.current.selectCell(location),
    []
  );
  const gridMove = useCallback(
    (id: string, location: CanvasLocation) =>
      gridActions.current.move(id, location),
    []
  );
  const add = () => {
    setRangeEnd(null);
    if (props.loading || props.error) return;
    let target = cell;
    while (at(target)) target = { ...target, row: target.row + 1 };
    setCell(target);
    props.onAdd(target);
  };
  const duplicateSelection = () => {
    const locations = props.onDuplicateNodes(rangeNodes.map((m) => m.id));
    if (!locations.length) return;
    const start = {
      row: Math.min(...locations.map((l) => l.row)),
      column: Math.min(...locations.map((l) => l.column)),
    };
    const end = {
      row: Math.max(...locations.map((l) => l.row)),
      column: Math.max(...locations.map((l) => l.column)),
    };
    selectRange(start, end);
    requestAnimationFrame(() => {
      reveal(start);
      scroll.current?.focus({ preventScroll: true });
    });
    setMessage(`Duplicated ${locations.length} nodes.`);
  };
  const finishDrag = () => {
    const current = dragRef.current;
    if (current) move(current.id, current.target);
    dragRef.current = null;
    setDrag(null);
  };
  return (
    <section
      className={styles.sheetView}
      hidden={!active}
      aria-label="Sheet workspace"
      onKeyDown={(event) => {
        if (
          (event.target as Element).closest(
            'input, textarea, [contenteditable="true"], [role="dialog"]'
          )
        )
          return;
        if (
          (event.ctrlKey || event.metaKey) &&
          !event.altKey &&
          event.key.toLowerCase() === "d"
        ) {
          event.preventDefault();
          event.stopPropagation();
          if (!event.repeat) duplicateSelection();
        }
      }}
    >
      <SheetToolbar
        add={add}
        hand={hand}
        setHand={setHand}
        areaMode={areaMode}
        setAreaMode={setAreaMode}
        canUndo={props.canUndo}
        canRedo={props.canRedo}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        cell={cell}
        simplified={simplified}
        disabled={props.loading || props.error}
        onDownload={props.onDownload}
      />
      <div
        onScroll={updatePinnedHeaders}
        className={`${styles.sheetScroll} ${
          handActive ? styles.sheetHand : areaMode ? styles.areaMode : ""
        }`}
        ref={scroll}
        tabIndex={0}
        aria-label="Sheet navigation"
        onClick={(event) => {
          if (!(event.target as Element).closest("[data-sheet-cell], button")) {
            setRangeEnd(null);
            props.onClear();
          }
        }}
        onClickCapture={(event) => {
          if ((handActive || suppressClick.current) && event.detail !== 0) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onDoubleClickCapture={(event) => {
          if (handActive || suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDown={(event) => {
          if (
            (event.target as Element).closest(
              'input, textarea, [contenteditable="true"]'
            )
          )
            return;
          if (event.ctrlKey || event.metaKey || event.altKey) return;
          if (event.key.toLowerCase() === "n") {
            event.preventDefault();
            if (!event.repeat) add();
            return;
          }
          if (event.code === "Space") {
            event.preventDefault();
            setSpaceHeld(true);
            return;
          }
          if (event.key === "Escape") {
            setHand(false);
            setSpaceHeld(false);
            setRangeEnd(null);
            setAreaMode(false);
          }
          if (event.key === "+" || event.key === "=") {
            event.preventDefault();
            zoomTo(zoomRef.current * 1.2);
            return;
          }
          if (event.key === "-") {
            event.preventDefault();
            zoomTo(zoomRef.current / 1.2);
            return;
          }
          const dirs: Record<string, CanvasLocation> = {
            ArrowLeft: { row: 0, column: -1 },
            ArrowRight: { row: 0, column: 1 },
            ArrowUp: { row: -1, column: 0 },
            ArrowDown: { row: 1, column: 0 },
          };
          const direction = dirs[event.key];
          if (direction && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            const from = event.shiftKey && rangeEnd ? rangeEnd : cell;
            const next = {
              row: Math.max(0, from.row + direction.row),
              column: Math.max(0, from.column + direction.column),
            };
            if (event.shiftKey) {
              selectRange(cell, next);
              reveal(next);
              scroll.current?.focus({ preventScroll: true });
            } else selectCell(next, true);
          }
          if (
            (event.key === "Delete" || event.key === "Backspace") &&
            (selectedId || rangeEnd)
          ) {
            event.preventDefault();
            if (rangeEnd) deleteRange();
            else props.onDelete();
          }
        }}
        onBlur={(event) => {
          if (event.target === event.currentTarget)
            delete event.currentTarget.dataset.pointerFocus;
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Tab")
            delete event.currentTarget.dataset.pointerFocus;
        }}
        onPointerDownCapture={(event) => {
          event.currentTarget.dataset.pointerFocus = "true";
          if (event.button !== 0 && event.button !== 1) return;
          suppressClick.current = false;
          const target = event.target as Element;
          const cellElement = target.closest("[data-sheet-cell]");
          emptyPress.current = null;
          if (
            event.button === 0 &&
            !handActive &&
            cellElement &&
            !target.closest("[data-sheet-node]") &&
            stage.current
          ) {
            const rect = stage.current.getBoundingClientRect();
            emptyPress.current = {
              pointerId: event.pointerId,
              location: cellAtPoint(
                (event.clientX - rect.left) / zoomRef.current,
                (event.clientY - rect.top) / zoomRef.current
              ),
              x: event.clientX,
              y: event.clientY,
            };
            const previous = lastEmptyTap.current;
            if (
              previous &&
              sameCell(previous.location, emptyPress.current.location) &&
              event.timeStamp - previous.time < 450
            ) {
              // The second tap must not focus the new card via a compatibility mouse event.
              event.preventDefault();
            }
          } else lastEmptyTap.current = null;
          const box = event.currentTarget;
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          });
          if (pointers.current.size === 2) {
            emptyPress.current = null;
            lastEmptyTap.current = null;
            const [a, b] = [...pointers.current.values()];
            const rect = box.getBoundingClientRect();
            pinch.current = {
              distance: Math.hypot(a.x - b.x, a.y - b.y),
              zoom: zoomRef.current,
              x:
                (box.scrollLeft + (a.x + b.x) / 2 - rect.left) /
                zoomRef.current,
              y: (box.scrollTop + (a.y + b.y) / 2 - rect.top) / zoomRef.current,
            };
            pan.current = null;
            if (rangeDrag.current) {
              setCell(rangeDrag.current.previousCell);
              setRangeEnd(rangeDrag.current.previousEnd);
            }
            rangeDrag.current = null;
            dragRef.current = null;
            setDrag(null);
            suppressClick.current = true;
            box.setPointerCapture(event.pointerId);
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          const handle = (event.target as Element).closest("[data-drag-node]");
          const touchPan =
            event.pointerType === "touch" && !handle && !areaMode;
          if (handActive || event.button === 1 || touchPan) {
            pan.current = {
              x: event.clientX,
              y: event.clientY,
              left: box.scrollLeft,
              top: box.scrollTop,
              empty: !(event.target as Element).closest("[data-sheet-node]"),
            };
            if (handActive || event.button === 1) {
              box.setPointerCapture(event.pointerId);
              event.preventDefault();
              event.stopPropagation();
              box.focus({ preventScroll: true });
            }
            return;
          }
          if (
            (event.pointerType === "mouse" || areaMode) &&
            (!referenceMode || areaMode) &&
            stage.current &&
            (event.target as Element).closest("[data-sheet-cell]")
          ) {
            const rect = stage.current.getBoundingClientRect();
            const location = cellAtPoint(
              (event.clientX - rect.left) / zoomRef.current,
              (event.clientY - rect.top) / zoomRef.current
            );
            if (event.shiftKey) {
              selectRange(cell, location);
              suppressClick.current = true;
              box.focus({ preventScroll: true });
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            const selectedHeader =
              handle &&
              rangeNodes.some(
                (m) => m.id === handle.getAttribute("data-drag-node")
              );
            if (!handle || (areaMode && !selectedHeader)) {
              rangeDrag.current = {
                start: location,
                x: event.clientX,
                y: event.clientY,
                moved: false,
                previousCell: cell,
                previousEnd: rangeEnd,
              };
              if (areaMode) {
                suppressClick.current = true;
                box.setPointerCapture(event.pointerId);
                event.preventDefault();
                event.stopPropagation();
                box.focus({ preventScroll: true });
              }
              return;
            }
          }
          if (!handle) return;
          const id = handle.getAttribute("data-drag-node")!;
          const metric = metrics.find((m) => m.id === id)!;
          event.preventDefault();
          box.setPointerCapture(event.pointerId);
          dragRef.current = { id, target: metric.location };
          setDrag(dragRef.current);
        }}
        onPointerMove={(event) => {
          if (
            emptyPress.current &&
            Math.hypot(
              event.clientX - emptyPress.current.x,
              event.clientY - emptyPress.current.y
            ) > 6
          ) {
            emptyPress.current = null;
            lastEmptyTap.current = null;
          }
          if (!pointers.current.has(event.pointerId)) return;
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          });
          const box = event.currentTarget;
          if (pinch.current && pointers.current.size >= 2) {
            const [a, b] = [...pointers.current.values()];
            const rect = box.getBoundingClientRect();
            zoomTo(
              (pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y)) /
                Math.max(1, pinch.current.distance)
            );
            pendingScroll.current = {
              x:
                pinch.current.x * zoomRef.current -
                ((a.x + b.x) / 2 - rect.left),
              y:
                pinch.current.y * zoomRef.current -
                ((a.y + b.y) / 2 - rect.top),
            };
            applyPendingScroll();
            suppressClick.current = true;
            return;
          }
          if (pan.current) {
            const dx = event.clientX - pan.current.x,
              dy = event.clientY - pan.current.y;
            if (Math.hypot(dx, dy) > 4 || suppressClick.current) {
              suppressClick.current = true;
              box.setPointerCapture(event.pointerId);
              box.scrollLeft = pan.current.left - dx;
              box.scrollTop = pan.current.top - dy;
            }
            return;
          }
          if (rangeDrag.current && stage.current) {
            const selecting = rangeDrag.current;
            if (
              !selecting.moved &&
              Math.hypot(
                event.clientX - selecting.x,
                event.clientY - selecting.y
              ) < 4
            )
              return;
            selecting.moved = true;
            suppressClick.current = true;
            box.setPointerCapture(event.pointerId);
            box.focus({ preventScroll: true });
            const bounds = box.getBoundingClientRect();
            if (event.clientX < bounds.left + 24) box.scrollLeft -= 20;
            if (event.clientX > bounds.right - 24) box.scrollLeft += 20;
            if (event.clientY < bounds.top + 24) box.scrollTop -= 20;
            if (event.clientY > bounds.bottom - 24) box.scrollTop += 20;
            const rect = stage.current.getBoundingClientRect();
            const end = cellAtPoint(
              (event.clientX - rect.left) / zoomRef.current,
              (event.clientY - rect.top) / zoomRef.current
            );
            selectRange(selecting.start, {
              row: Math.min(rowCount - 1, end.row),
              column: Math.min(columnCount - 1, end.column),
            });
            return;
          }
          if (!dragRef.current || !stage.current) return;
          suppressClick.current = true;
          const rect = stage.current.getBoundingClientRect();
          const target = cellAtPoint(
            (event.clientX - rect.left) / zoomRef.current,
            (event.clientY - rect.top) / zoomRef.current
          );
          dragRef.current = { ...dragRef.current, target };
          setDrag(dragRef.current);
          setExtent((old) => ({
            rows: Math.max(old.rows, target.row + 2),
            columns: Math.max(old.columns, target.column + 2),
          }));
        }}
        onPointerUp={(event) => {
          const press = emptyPress.current;
          emptyPress.current = null;
          let created = false;
          if (
            press &&
            press.pointerId === event.pointerId &&
            !pinch.current &&
            !at(press.location) &&
            !props.loading &&
            !props.error
          ) {
            const previous = lastEmptyTap.current;
            if (
              previous &&
              sameCell(previous.location, press.location) &&
              event.timeStamp - previous.time < 450 &&
              Math.hypot(press.x - previous.x, press.y - previous.y) < 24
            ) {
              lastEmptyTap.current = null;
              setRangeEnd(null);
              setCell(press.location);
              props.onAdd(press.location);
              suppressClick.current = true;
              created = true;
            } else lastEmptyTap.current = { ...press, time: event.timeStamp };
          }
          if (pan.current?.empty && !suppressClick.current && !pinch.current) {
            setRangeEnd(null);
            props.onClear();
          }
          if (
            !created &&
            areaMode &&
            rangeDrag.current &&
            !rangeDrag.current.moved
          ) {
            if (at(rangeDrag.current.start))
              selectRange(rangeDrag.current.start, rangeDrag.current.start);
            else selectCell(rangeDrag.current.start);
          }
          rangeDrag.current = null;
          if (!pinch.current && !pan.current) finishDrag();
          pointers.current.delete(event.pointerId);
          pinch.current = null;
          pan.current = null;
          const remaining = [...pointers.current.values()][0];
          if (remaining)
            pan.current = {
              x: remaining.x,
              y: remaining.y,
              left: event.currentTarget.scrollLeft,
              top: event.currentTarget.scrollTop,
            };
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          emptyPress.current = null;
          lastEmptyTap.current = null;
          if (rangeDrag.current) {
            setCell(rangeDrag.current.previousCell);
            setRangeEnd(rangeDrag.current.previousEnd);
          }
          rangeDrag.current = null;
          pointers.current.clear();
          pan.current = null;
          pinch.current = null;
          dragRef.current = null;
          setDrag(null);
        }}
      >
        <div
          className={styles.sheetScaleBounds}
          style={{
            width: (SHEET_GUTTER + columnCount * SHEET_COLUMN) * zoom,
            height: (SHEET_HEADING + rowCount * SHEET_ROW) * zoom,
          }}
        >
          <div
            ref={stage}
            className={styles.sheetStage}
            role="grid"
            aria-label="Model sheet"
            aria-multiselectable="true"
            aria-rowcount={rowCount + 1}
            aria-colcount={columnCount + 1}
            style={{
              width: SHEET_GUTTER + columnCount * SHEET_COLUMN,
              height: SHEET_HEADING + rowCount * SHEET_ROW,
              transform: `scale(${zoom})`,
            }}
          >
            <div
              ref={columnHeadings}
              className={styles.sheetColumnHeadings}
              role="row"
            >
              <div
                ref={corner}
                className={styles.sheetCorner}
                role="columnheader"
                aria-label="Row"
              />
              {Array.from({ length: columnCount }, (_, column) => (
                <div role="columnheader" key={column}>
                  {columnName(column)}
                </div>
              ))}
            </div>
            <div
              ref={rowHeadings}
              className={styles.sheetRowHeadings}
              aria-hidden="true"
            >
              {Array.from({ length: rowCount }, (_, row) => (
                <div
                  key={row}
                  className={styles.sheetRowHeading}
                  data-sheet-row-label
                >
                  {row + 1}
                </div>
              ))}
            </div>
            <SheetGrid
              metrics={metrics}
              edges={props.edges}
              rowCount={rowCount}
              columnCount={columnCount}
              cell={cell}
              rangeEnd={rangeEnd}
              selectedId={selectedId}
              drag={drag}
              simplified={simplified}
              referenceMode={referenceMode}
              loading={props.loading}
              error={props.error}
              selectCell={gridSelectCell}
              move={gridMove}
              onAdd={props.onAdd}
            />
          </div>
        </div>
        <div className={styles.sheetExtend}>
          <button
            type="button"
            onClick={() =>
              setExtent({ rows: rowCount + 5, columns: columnCount })
            }
          >
            Add rows
          </button>
          <button
            type="button"
            onClick={() =>
              setExtent({ rows: rowCount, columns: columnCount + 3 })
            }
          >
            Add columns
          </button>
        </div>
      </div>
      {(rangeEnd || selectedId) && (
        <SelectionActions
          surface="sheet"
          count={rangeNodes.length}
          onDuplicate={duplicateSelection}
          onDelete={deleteRange}
          onClear={() => {
            setRangeEnd(null);
            props.onClear();
          }}
        />
      )}
      <div className={styles.sheetZoom} role="group" aria-label="Sheet zoom">
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom out"
          disabled={zoom <= MIN_SHEET_SCALE}
          onClick={() => zoomTo(zoom / 1.2)}
        >
          <Icon name="minus" />
        </button>
        <button
          type="button"
          className={styles.sheetZoomLevel}
          aria-label="Reset zoom"
          onClick={() => zoomTo(SHEET_BASE_SCALE)}
        >
          {Math.round((zoom / SHEET_BASE_SCALE) * 100)}%
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom in"
          disabled={zoom >= MAX_SHEET_SCALE}
          onClick={() => zoomTo(zoom * 1.2)}
        >
          <Icon name="plus" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Fit model"
          onClick={fit}
        >
          <Icon name="fit" />
        </button>
      </div>
      {(props.loading || props.error) && (
        <div
          className={styles.canvasMessage}
          role={props.error ? "alert" : "status"}
        >
          {props.error ? (
            <>
              <p>Couldn’t load the model.</p>
              <button
                type="button"
                className={styles.signIn}
                onClick={props.onRetry}
              >
                Try again
              </button>
            </>
          ) : (
            <p>Loading model…</p>
          )}
        </div>
      )}
      <div role="status" className={styles.liveStatus}>
        {message}
      </div>
    </section>
  );
}

// Keep the sheet mounted to preserve its scroll, zoom and selection, but don't
// reconcile its entire grid during gestures in the other view.
export const SheetView = memo(
  SheetViewComponent,
  (previous, next) => !previous.active && !next.active
);
