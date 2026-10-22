import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { CanvasLocation } from "~/lib/locationUtils";
import { CanvasNode } from "./CanvasNode";
import { FieldHelp } from "./FieldHelp";
import { Icon } from "./Icon";
import { connectionPath } from "./geometry";
import {
  cellAtPoint,
  cellName,
  columnName,
  sameCell,
  sheetPoint,
  SHEET_COLUMN,
  SHEET_ROW,
  SHEET_GUTTER,
  SHEET_HEADING,
  SHEET_INSET,
} from "./sheetGeometry";
import styles from "./workspace.module.css";

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

export function SheetView(props: Props) {
  const { active, metrics, selectedId, referenceMode } = props;
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
  const scroll = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [hand, setHand] = useState(false);
  const [areaMode, setAreaMode] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const pendingScroll = useRef<{ x: number; y: number } | null>(null);
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
  const handActive = hand || spaceHeld;
  const zoomTo = (value: number, x?: number, y?: number) => {
    const box = scroll.current;
    if (!box) return;
    const next = Math.max(0.25, Math.min(2, value));
    const anchorX = x ?? box.clientWidth / 2;
    const anchorY = y ?? box.clientHeight / 2;
    pendingScroll.current = {
      x: ((box.scrollLeft + anchorX) * next) / zoomRef.current - anchorX,
      y: ((box.scrollTop + anchorY) * next) / zoomRef.current - anchorY,
    };
    zoomRef.current = next;
    setZoom(next);
    requestAnimationFrame(() => {
      if (pendingScroll.current && scroll.current) {
        scroll.current.scrollLeft = pendingScroll.current.x;
        scroll.current.scrollTop = pendingScroll.current.y;
        pendingScroll.current = null;
      }
    });
  };
  useLayoutEffect(() => {
    if (pendingScroll.current && scroll.current) {
      scroll.current.scrollLeft = pendingScroll.current.x;
      scroll.current.scrollTop = pendingScroll.current.y;
      pendingScroll.current = null;
    }
  });
  useEffect(() => {
    const box = scroll.current;
    if (!box) return;
    const wheel = (event: WheelEvent) => {
      if (!handActive && !event.ctrlKey) return;
      event.preventDefault();
      const rect = box.getBoundingClientRect();
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
          ? box.clientHeight
          : 1;
      zoomTo(
        zoomRef.current *
          Math.exp(-event.deltaY * unit * (event.ctrlKey ? 0.01 : 0.002)),
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    };
    box.addEventListener("wheel", wheel, { passive: false });
    return () => box.removeEventListener("wheel", wheel);
  }, [handActive]);
  useEffect(() => {
    const release = () => setSpaceHeld(false);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", release);
    };
  }, []);
  const fit = () => {
    const box = scroll.current;
    if (!box || !metrics.length) return;
    const left =
      Math.min(...metrics.map((m) => m.location.column)) * SHEET_COLUMN;
    const top = Math.min(...metrics.map((m) => m.location.row)) * SHEET_ROW;
    const width =
      (Math.max(...metrics.map((m) => m.location.column)) + 1) * SHEET_COLUMN -
      left +
      SHEET_GUTTER;
    const height =
      (Math.max(...metrics.map((m) => m.location.row)) + 1) * SHEET_ROW -
      top +
      SHEET_HEADING;
    zoomTo(
      Math.min(
        (box.clientWidth - 24) / width,
        (box.clientHeight - 24) / height,
        1
      )
    );
    pendingScroll.current = {
      x: left * zoomRef.current,
      y: top * zoomRef.current,
    };
  };
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
  const at = (location: CanvasLocation) =>
    metrics.find((m) => sameCell(m.location, location));
  const selectedLocation = metrics.find((m) => m.id === selectedId)?.location;
  const reveal = (location: CanvasLocation) => {
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
  };
  useEffect(() => {
    if (!active) return;
    const metric = metrics.find((m) => m.id === selectedId);
    if (metric) {
      setCell(metric.location);
      reveal(metric.location);
    }
  }, [active, selectedId, selectedLocation?.row, selectedLocation?.column]);
  useEffect(() => {
    const box = scroll.current;
    if (!box) return;
    const observer = new ResizeObserver(() => {
      if (active && selectedId) {
        const metric = metrics.find((m) => m.id === selectedId);
        if (metric) reveal(metric.location);
      }
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [active, selectedId, selectedLocation?.row, selectedLocation?.column]);
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
      <div
        className={styles.sheetToolbar}
        role="toolbar"
        aria-label="Sheet tools"
      >
        <button
          type="button"
          className={styles.addButton}
          aria-label="Add node"
          title="Add node"
          disabled={props.loading || props.error}
          onClick={add}
        >
          <Icon name="plus" />
          <span className={styles.sheetAddLabel}>Add node</span>
        </button>
        <span className={styles.divider} />
        <button
          type="button"
          className={`${styles.iconButton} ${styles.sheetSelectTool}`}
          aria-label="Select tool"
          aria-pressed={!hand && !areaMode}
          onClick={() => {
            setHand(false);
            setAreaMode(false);
          }}
        >
          <Icon name="cursor" />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.sheetHandTool}`}
          aria-label="Hand tool"
          aria-pressed={hand}
          onClick={() => {
            setHand(true);
            setAreaMode(false);
          }}
        >
          <Icon name="hand" />
        </button>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.touchSelectionTool}`}
          aria-label="Select an area"
          title="Select an area"
          aria-pressed={areaMode}
          onClick={() => {
            setAreaMode(!areaMode);
            setHand(false);
          }}
        >
          <Icon name="selection" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Undo"
          disabled={!props.canUndo}
          onClick={props.onUndo}
        >
          <Icon name="undo" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Redo"
          disabled={!props.canRedo}
          onClick={props.onRedo}
        >
          <Icon name="redo" />
        </button>
        <span className={styles.sheetCellAddress} aria-label="Selected cell">
          {cellName(cell)}
        </span>
        <FieldHelp label="Sheet help">
          <p>
            Double-click or double-tap an empty cell to add a node, or select it
            and press Enter. N adds a node at the selected cell or the next
            empty cell below. Use arrow keys to move between cells. Drag across
            cells to select a range, or use Shift-click and Shift-arrow keys.
            Delete removes the selected nodes; Undo restores them. Drag a
            selected header to move the whole group. Drag a node’s header to
            move it to an empty cell. Use the hand tool or hold Space to drag
            the sheet. Swipe to pan on touch screens; pinch to zoom. The mouse
            wheel scrolls in Select mode and zooms in Hand mode. Ctrl/⌘ D
            duplicates selected nodes. While editing a value, Enter moves down
            and Tab moves right, creating a node if the next cell is empty.
            Formulas use the reference IDs on nodes.
          </p>
        </FieldHelp>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Download JSON"
          disabled={props.loading || props.error}
          onClick={props.onDownload}
        >
          <Icon name="download" />
        </button>
      </div>
      <div
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
          ref={stage}
          className={styles.sheetStage}
          role="grid"
          aria-label="Model sheet"
          aria-multiselectable="true"
          aria-rowcount={rowCount + 1}
          aria-colcount={columnCount + 1}
          style={{
            width: SHEET_GUTTER + columnCount * SHEET_COLUMN,
            ...{ zoom },
          }}
        >
          <div className={styles.sheetColumnHeadings} role="row">
            <div
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
          {Array.from({ length: rowCount }, (_, row) => (
            <div className={styles.sheetRow} role="row" key={row}>
              <div className={styles.sheetRowHeading} role="rowheader">
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
                        metric={metric}
                        surface="sheet"
                        position={SHEET_INSET}
                        selected={selectedId === metric.id || inRange(location)}
                        referenceMode={referenceMode}
                        onSelect={() => {
                          setRangeEnd(null);
                          setCell(location);
                          props.onSelect(metric.id);
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
              const from = metrics.find((m) => m.id === edge.input),
                to = metrics.find((m) => m.id === edge.output);
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
        <div
          className={styles.sheetSelection}
          role="group"
          aria-label="Selected range"
        >
          <span aria-label={`${rangeNodes.length} selected nodes`}>
            {rangeNodes.length}{" "}
            <span className={styles.selectionCountLabel}>
              {rangeNodes.length === 1 ? "node" : "nodes"}
            </span>
          </span>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Duplicate selected nodes"
            title="Duplicate"
            disabled={!rangeNodes.length}
            onClick={duplicateSelection}
          >
            <Icon name="duplicate" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Delete selected nodes"
            disabled={!rangeNodes.length}
            onClick={deleteRange}
          >
            <Icon name="trash" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Clear selection"
            onClick={() => {
              setRangeEnd(null);
              props.onClear();
            }}
          >
            <Icon name="close" />
          </button>
        </div>
      )}
      <div className={styles.sheetZoom} role="group" aria-label="Sheet zoom">
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom out"
          disabled={zoom <= 0.25}
          onClick={() => zoomTo(zoom / 1.2)}
        >
          <Icon name="minus" />
        </button>
        <button
          type="button"
          className={styles.sheetZoomLevel}
          aria-label="Reset zoom"
          onClick={() => zoomTo(1)}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Zoom in"
          disabled={zoom >= 2}
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
              <p>Couldn’t load the example.</p>
              <button
                type="button"
                className={styles.signIn}
                onClick={props.onRetry}
              >
                Try again
              </button>
            </>
          ) : (
            <p>Loading scratchpad…</p>
          )}
        </div>
      )}
      <div role="status" className={styles.liveStatus}>
        {message}
      </div>
    </section>
  );
}
