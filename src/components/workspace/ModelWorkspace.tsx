import { useCanvasAreaSelection } from "./useCanvasAreaSelection";
import { useWorkspaceModel } from "./useWorkspaceModel";
import { useCanvasWheel } from "./useCanvasWheel";
import type { CanvasGesture } from "./canvasTypes";
import { downloadWorkspace } from "./downloadWorkspace";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const PerformanceDiagnostics = dynamic(
  () => import("./PerformanceDiagnostics"),
  { ssr: false }
);
import { ErrorModal } from "~/components/layout/ErrorModal";
import { ModalContainer } from "~/modules/modal/routes";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { denormalizedSpaceSelector } from "~/components/spaces/denormalized-space-selector";
import {
  addWorkspaceNode,
  duplicateWorkspaceNodes,
  moveWorkspaceNodes,
  moveWorkspaceCanvasNodes,
  duplicateWorkspaceCanvasNodes,
} from "~/modules/workspace/nodeActions";
import { canUseOrganizationFacts } from "~/lib/engine/space";
import { SCRATCHPAD_ID } from "~/modules/scratchpad/model";
import { changeMetric, removeMetrics } from "~/modules/metrics/actions";
import { changeWorkspaceHistory } from "./modelActions";
import { changeMetricClickMode } from "~/modules/canvas_state/actions";
import { CanvasScene } from "./CanvasScene";
import { NodeInspector } from "./NodeInspector";
import { usePanelResize } from "./usePanelResize";
import { SheetView } from "./SheetView";
import { CanvasLocation } from "~/lib/locationUtils";
import { ModelDetails } from "./ModelDetails";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { CanvasControls } from "./CanvasControls";
import {
  Point,
  Viewport,
  fitNodes,
  zoomAt,
  toWorld,
  canvasGridPosition,
  NODE_WIDTH,
  NODE_HEIGHT,
} from "./geometry";
import styles from "./workspace.module.css";
import { useSimplifiedNodes } from "./useNodeAppearance";

const VIEW_PREFERENCE_KEY = "guesstimate.workspace.view";

const isField = (target: EventTarget | null) =>
  target instanceof Element &&
  !!target.closest('input, textarea, select, [contenteditable="true"]');

export function ModelWorkspace({
  spaceId = SCRATCHPAD_ID,
  shareableLinkToken = null,
  initialCalculatorId,
  factsShown = false,
  showCalculatorResults = false,
}: {
  spaceId?: number;
  shareableLinkToken?: string | null;
  initialCalculatorId?: number;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
}) {
  const [diagnostics, setDiagnostics] = useState(false);
  useEffect(() => {
    setDiagnostics(
      new URLSearchParams(window.location.search).get("perf") === "1"
    );
  }, []);
  const simplified = useSimplifiedNodes();
  const isScratchpad = spaceId === SCRATCHPAD_ID;
  const [detailsOpen, setDetailsOpen] = useState(
    !!initialCalculatorId || factsShown
  );
  const [viewMode, setViewMode] = useState<"canvas" | "sheet">("sheet");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_PREFERENCE_KEY);
      if (saved === "canvas" || saved === "sheet") setViewMode(saved);
    } catch {
      // The workspace remains usable when browser storage is unavailable.
    }
  }, []);
  const { mainRef, panelStyle, resizeHandle, resizing } = usePanelResize();
  const dispatch = useAppDispatch();
  const { denormalizedSpace: space } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId })
  );
  const metrics = useMemo(() => space.metrics || [], [space.metrics]);
  const metricsById = useMemo(
    () => new Map(metrics.map((metric) => [metric.id, metric])),
    [metrics]
  );
  const { loading, error, load } = useWorkspaceModel(
    spaceId,
    shareableLinkToken
  );
  const [formulaFocusId, setFormulaFocusId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSelection, setCanvasSelection] = useState<string[]>([]);
  const [areaMode, setAreaMode] = useState(false);
  const selectionBeforeGesture = useRef<string[]>([]);
  const suppressCanvasClick = useRef(false);
  const canvasPointerStartedOnNode = useRef(false);
  const activeSelection = canvasSelection.filter((id) => metricsById.has(id));
  const selectionRef = useRef(activeSelection);
  selectionRef.current = activeSelection;
  const canvasActionIds = activeSelection.length
    ? activeSelection
    : metrics.some((m) => m.id === selectedId)
    ? [selectedId!]
    : [];
  const [help, setHelp] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [view, setViewState] = useState<Viewport>({ x: 80, y: 100, zoom: 1 });
  const viewRef = useRef(view);
  const setView = useCallback((next: Viewport) => {
    viewRef.current = next;
    setViewState(next);
  }, []);
  const [dragPosition, setDragPosition] = useState<{
    id: string;
    point: Point;
  } | null>(null);
  const dragRef = useRef<typeof dragPosition>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const gesture = useRef<CanvasGesture | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const touchTap = useRef<{ id: number; point: Point; time: number } | null>(
    null
  );
  const previousTouchTap = useRef<{ point: Point; time: number } | null>(null);
  const lastTouchTime = useRef(0);
  useEffect(() => {
    touchTap.current = null;
    previousTouchTap.current = null;
  }, [viewMode, areaMode, spaceHeld]);
  const fitted = useRef(false);
  const selected = selectedId ? metricsById.get(selectedId) : undefined;
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;
  const { spacingPositions } = useCanvasWheel({
    spaceId,
    viewport,
    metricsRef,
    selectionRef,
    gesture,
    viewRef,
    setView,
  });
  const {
    selectionBox,
    setSelectionBox,
    selectionPointer,
    updateAreaSelection,
  } = useCanvasAreaSelection({
    viewport,
    gesture,
    viewRef,
    metricsRef,
    setView,
    setCanvasSelection,
  });

  const basePosition = (metric: (typeof metrics)[number]): Point =>
    metric.canvasPosition || canvasGridPosition(metric.location);
  const positionOf = (metric: (typeof metrics)[number]): Point => {
    if (spacingPositions[metric.id]) return spacingPositions[metric.id];
    if (!dragPosition) return basePosition(metric);
    if (dragPosition.id === metric.id) return dragPosition.point;
    if (
      activeSelection.includes(dragPosition.id) &&
      activeSelection.includes(metric.id)
    ) {
      const anchor = metricsById.get(dragPosition.id);
      if (anchor) {
        const start = basePosition(anchor),
          point = basePosition(metric);
        return {
          x: point.x + dragPosition.point.x - start.x,
          y: point.y + dragPosition.point.y - start.y,
        };
      }
    }
    return basePosition(metric);
  };
  const fit = useCallback(() => {
    const box = viewport.current;
    if (!box) return;
    setView(
      fitNodes(
        metricsRef.current.map(
          (m) => m.canvasPosition || canvasGridPosition(m.location)
        ),
        box.clientWidth,
        box.clientHeight
      )
    );
  }, []);
  useEffect(() => {
    if (
      viewMode === "canvas" &&
      !loading &&
      !error &&
      metrics.length &&
      !fitted.current
    ) {
      fitted.current = true;
      const box = viewport.current;
      const first = metricsRef.current[0];
      if (box && first && box.clientWidth < 650) {
        const position = first.canvasPosition || { x: 0, y: 0 };
        setView({
          x: (box.clientWidth - NODE_WIDTH * 0.85) / 2 - position.x * 0.85,
          y: 110 - position.y * 0.85,
          zoom: 0.85,
        });
      } else fit();
    }
  }, [loading, error, metrics.length, fit, viewMode]);

  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  useEffect(() => {
    const box = viewport.current;
    if (!box) return;
    const keepVisible = () => {
      if (!box.clientWidth || !box.clientHeight) return;
      setCanvasHeight(box.clientHeight);
      const metric = metricsRef.current.find(
        (m) => m.id === selectedRef.current
      );
      if (!metric) return;
      const position =
        metric.canvasPosition || canvasGridPosition(metric.location);
      const v = viewRef.current;
      const x = position.x * v.zoom + v.x,
        y = position.y * v.zoom + v.y;
      const clipped =
        x < 16 ||
        x + NODE_WIDTH * v.zoom > box.clientWidth - 16 ||
        y < 78 ||
        y + NODE_HEIGHT * v.zoom > box.clientHeight - 65;
      if (clipped)
        setView({
          ...v,
          x: (box.clientWidth - NODE_WIDTH * v.zoom) / 2 - position.x * v.zoom,
          y:
            Math.max(80, (box.clientHeight - NODE_HEIGHT * v.zoom) / 2) -
            position.y * v.zoom,
        });
    };
    const observer = new ResizeObserver(keepVisible);
    observer.observe(box);
    const frame = requestAnimationFrame(keepVisible);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [selectedId, viewMode]);

  const select = (id: string) => {
    if (space.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT") {
      window.dispatchEvent(
        new CustomEvent("functionMetricClicked", {
          detail: metrics.find((m) => m.id === id),
        })
      );
      return;
    }
    setCanvasSelection([]);
    setFormulaFocusId(null);
    setSelectedId(id);
  };
  const closeDetails = () => {
    setFormulaFocusId(null);
    setSelectedId(null);
    dispatch(changeMetricClickMode("DEFAULT"));
  };
  const move = (id: string, point: Point) => {
    const metric = metrics.find((m) => m.id === id);
    if (metric && activeSelection.includes(id) && activeSelection.length > 1) {
      const start = basePosition(metric);
      dispatch(
        moveWorkspaceCanvasNodes(
          activeSelection,
          {
            x: point.x - start.x,
            y: point.y - start.y,
          },
          spaceId
        )
      );
    } else dispatch(changeMetric({ id, canvasPosition: point }));
  };
  const duplicateSelection = () => {
    if (!canvasActionIds.length) return;
    const copies = dispatch(
      duplicateWorkspaceCanvasNodes(canvasActionIds, spaceId)
    );
    closeDetails();
    setCanvasSelection(copies.map((m) => m.id));
    requestAnimationFrame(() => {
      const box = viewport.current;
      if (box && copies.length)
        setView(
          fitNodes(
            copies.map((m) => m.canvasPosition!),
            box.clientWidth,
            box.clientHeight
          )
        );
      viewport.current?.focus();
    });
  };
  const remove = () => {
    if (viewMode === "canvas" && activeSelection.length) {
      dispatch(removeMetrics(activeSelection));
      setCanvasSelection([]);
      closeDetails();
      viewport.current?.focus();
      return;
    }
    if (selectedId) {
      dispatch(removeMetrics([selectedId]));
      closeDetails();
      viewport.current?.focus();
    }
  };
  const add = (point?: Point) => {
    setCanvasSelection([]);
    setAreaMode(false);
    const box = viewport.current;
    if (!box) return;
    const center =
      point ||
      toWorld(
        { x: box.clientWidth / 2, y: box.clientHeight / 2 },
        viewRef.current
      );
    // Offset new nodes until they have their own visible space.
    let position = {
      x: center.x - NODE_WIDTH / 2,
      y: center.y - NODE_HEIGHT / 2,
    };
    while (
      metrics.some((m) => {
        const p = positionOf(m);
        return (
          Math.abs(p.x - position.x) < 40 && Math.abs(p.y - position.y) < 40
        );
      })
    )
      position = { x: position.x + 40, y: position.y + 40 };
    const id = dispatch(addWorkspaceNode(position, undefined, spaceId));
    setSelectedId(id);
    setFormulaFocusId(id);
  };
  const addSheetNode = (location: CanvasLocation) => {
    if (
      loading ||
      error ||
      metrics.some(
        (m) =>
          m.location.row === location.row &&
          m.location.column === location.column
      )
    )
      return;
    let position = canvasGridPosition(location);
    while (
      metrics.some((m) => {
        const p = positionOf(m);
        return (
          Math.abs(p.x - position.x) < 40 && Math.abs(p.y - position.y) < 40
        );
      })
    )
      position = { x: position.x + 40, y: position.y + 40 };
    const id = dispatch(addWorkspaceNode(position, location, spaceId));
    setSelectedId(id);
    setFormulaFocusId(id);
    return id;
  };
  const advanceSheetInput = (direction: "down" | "right") => {
    if (!selected) return;
    const location = {
      row: selected.location.row + (direction === "down" ? 1 : 0),
      column: selected.location.column + (direction === "right" ? 1 : 0),
    };
    const existing = metrics.find(
      (m) =>
        m.location.row === location.row && m.location.column === location.column
    );
    const id = existing?.id || addSheetNode(location);
    if (id) {
      setCanvasSelection([]);
      setSelectedId(id);
      setFormulaFocusId(id);
      dispatch(changeMetricClickMode("DEFAULT"));
    }
  };
  const zoom = (factor: number) => {
    const box = viewport.current;
    if (box)
      setView(
        zoomAt(
          viewRef.current,
          { x: box.clientWidth / 2, y: box.clientHeight / 2 },
          viewRef.current.zoom * factor
        )
      );
  };
  const resetZoom = () => {
    const box = viewport.current;
    if (box)
      setView(
        zoomAt(
          viewRef.current,
          { x: box.clientWidth / 2, y: box.clientHeight / 2 },
          1
        )
      );
  };

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if ((event.target as Element)?.closest?.('[role="dialog"]')) return;
      if (isField(event.target)) return;
      if (event.code === "Space" && event.target === viewport.current) {
        event.preventDefault();
        setSpaceHeld(true);
      }
      if (event.key === "Escape") {
        closeDetails();
        setHelp(false);
        setSpaceHeld(false);
        setCanvasSelection([]);
        setSelectionBox(null);
        setAreaMode(false);
        gesture.current = null;
        dragRef.current = null;
        setDragPosition(null);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        dispatch(
          event.shiftKey
            ? changeWorkspaceHistory(spaceId, true)
            : changeWorkspaceHistory(spaceId, false)
        );
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        dispatch(changeWorkspaceHistory(spaceId, true));
      }
      if (
        viewMode === "canvas" &&
        viewport.current?.contains(event.target as Node) &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        if (!event.repeat) duplicateSelection();
        return;
      }
      if (
        viewMode === "canvas" &&
        viewport.current?.contains(event.target as Node) &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        (event.key === "Delete" || event.key === "Backspace")
      ) {
        event.preventDefault();
        remove();
        return;
      }
      if (
        event.target !== viewport.current ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        if (!event.repeat) add();
      }
      if (event.key.toLowerCase() === "f") fit();
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoom(1.2);
      }
      if (event.key === "-") {
        event.preventDefault();
        zoom(1 / 1.2);
      }
      const dirs: Record<string, Point> = {
        ArrowLeft: { x: 60, y: 0 },
        ArrowRight: { x: -60, y: 0 },
        ArrowUp: { x: 0, y: 60 },
        ArrowDown: { x: 0, y: -60 },
      };
      if (dirs[event.key]) {
        event.preventDefault();
        const v = viewRef.current;
        setView({
          ...v,
          x: v.x + dirs[event.key].x,
          y: v.y + dirs[event.key].y,
        });
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    const blur = () => setSpaceHeld(false);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", blur);
    };
  });

  const localPoint = (event: { clientX: number; clientY: number }): Point => {
    const rect = viewport.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const pinchData = () => {
    const [a, b] = [...pointers.current.values()];
    return {
      midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
    };
  };
  const commitDrag = () => {
    const drag = dragRef.current;
    if (drag) {
      move(drag.id, drag.point);
      dragRef.current = null;
      setDragPosition(null);
    }
  };
  const startPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || (event.button !== 0 && event.button !== 1))
      return;
    const target = event.target as Element;
    if (target.closest("[data-canvas-control]")) return;
    suppressCanvasClick.current = false;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 2) {
      if (gesture.current?.kind === "select") {
        setSelectionBox(null);
        setCanvasSelection(selectionBeforeGesture.current);
        suppressCanvasClick.current = true;
      }
      commitDrag();
      gesture.current = {
        kind: "pinch",
        ...pinchData(),
        view: viewRef.current,
      };
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    const selectedHeader = target
      .closest("[data-drag-node]")
      ?.getAttribute("data-drag-node");
    const moveSelectedHeader =
      areaMode &&
      !event.shiftKey &&
      selectedHeader &&
      activeSelection.includes(selectedHeader);
    if (
      (event.shiftKey || areaMode) &&
      !moveSelectedHeader &&
      !spaceHeld &&
      event.button === 0
    ) {
      selectionBeforeGesture.current = activeSelection;
      const start = toWorld(point, viewRef.current);
      selectionPointer.current = point;
      gesture.current = { kind: "select", start };
      setSelectionBox({ start, end: start });
      setCanvasSelection([]);
      closeDetails();
      suppressCanvasClick.current = true;
      event.currentTarget.focus({ preventScroll: true });
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    const dragId = target
      .closest("[data-drag-node]")
      ?.getAttribute("data-drag-node");
    if (dragId && !spaceHeld && event.button === 0) {
      if (!activeSelection.includes(dragId)) setCanvasSelection([]);
      const metric = metrics.find((m) => m.id === dragId)!;
      gesture.current = {
        kind: "node",
        id: dragId,
        start: point,
        origin: positionOf(metric),
      };
    } else if (
      !target.closest("[data-node]") ||
      spaceHeld ||
      event.button === 1
    ) {
      gesture.current = {
        kind: "pan",
        start: point,
        origin: viewRef.current,
        deselectOnClick: !target.closest("[data-node]"),
      };
      event.currentTarget.focus();
    } else return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const tap = touchTap.current;
    if (
      tap &&
      tap.id === event.pointerId &&
      Math.hypot(event.clientX - tap.point.x, event.clientY - tap.point.y) > 8
    ) {
      touchTap.current = null;
      previousTouchTap.current = null;
    }
    if (!pointers.current.has(event.pointerId)) return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    const current = gesture.current;
    if (!current) return;
    if (current.kind === "select") {
      selectionPointer.current = point;
      updateAreaSelection(current.start, toWorld(point, viewRef.current));
    } else if (current.kind === "pinch" && pointers.current.size >= 2) {
      const pinch = pinchData();
      const next = zoomAt(
        current.view,
        current.midpoint,
        (current.view.zoom * pinch.distance) / current.distance
      );
      setView({
        ...next,
        x: next.x + pinch.midpoint.x - current.midpoint.x,
        y: next.y + pinch.midpoint.y - current.midpoint.y,
      });
    } else if (current.kind === "pan") {
      if (Math.hypot(point.x - current.start.x, point.y - current.start.y) > 4)
        current.moved = true;
      setView({
        ...viewRef.current,
        x: current.origin.x + point.x - current.start.x,
        y: current.origin.y + point.y - current.start.y,
      });
    } else if (current.kind === "node") {
      const pointNow = {
        x:
          current.origin.x + (point.x - current.start.x) / viewRef.current.zoom,
        y:
          current.origin.y + (point.y - current.start.y) / viewRef.current.zoom,
      };
      const drag = { id: current.id!, point: pointNow };
      dragRef.current = drag;
      setDragPosition(drag);
    }
  };
  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    let createAt: Point | undefined;
    if (event.pointerType === "touch") {
      const now = Date.now();
      lastTouchTime.current = now;
      const tap = touchTap.current;
      touchTap.current = null;
      if (
        tap?.id === event.pointerId &&
        now - tap.time <= 300 &&
        Math.hypot(event.clientX - tap.point.x, event.clientY - tap.point.y) <=
          8 &&
        current?.kind === "pan" &&
        !current.moved &&
        !areaMode &&
        !spaceHeld &&
        pointers.current.size === 1
      ) {
        const previous = previousTouchTap.current;
        if (
          previous &&
          now - previous.time <= 350 &&
          Math.hypot(
            event.clientX - previous.point.x,
            event.clientY - previous.point.y
          ) <= 24
        ) {
          createAt = toWorld(localPoint(event), viewRef.current);
          previousTouchTap.current = null;
        } else {
          previousTouchTap.current = {
            point: { x: event.clientX, y: event.clientY },
            time: now,
          };
        }
      } else {
        previousTouchTap.current = null;
      }
    }
    if (current?.kind === "pan" && current.deselectOnClick && !current.moved) {
      setCanvasSelection([]);
      closeDetails();
    }
    pointers.current.delete(event.pointerId);
    if (gesture.current?.kind === "select") setSelectionBox(null);
    commitDrag();
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointers.current.size === 1) {
      const point = [...pointers.current.values()][0];
      gesture.current = { kind: "pan", start: point, origin: viewRef.current };
    }
    if (createAt) add(createAt);
  };

  const download = () => downloadWorkspace(space, metrics, isScratchpad);
  const canUndo =
    space.checkpointMetadata.head < space.checkpointMetadata.length - 1;
  const canRedo = space.checkpointMetadata.head > 0;
  return (
    <>
      {diagnostics && <PerformanceDiagnostics />}
      <div className={styles.workspace}>
        <Head>
          <title key="title">
            {isScratchpad ? "Scratchpad" : space.name || "Model"} — Guesstimate
          </title>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
        </Head>
        <ErrorModal />
        <ModalContainer />
        <WorkspaceHeader
          model={isScratchpad ? undefined : space}
          onDetails={() => setDetailsOpen(true)}
          view={viewMode}
          onViewChange={(mode) => {
            dispatch(changeMetricClickMode("DEFAULT"));
            setSpaceHeld(false);
            setHelp(false);
            setViewMode(mode);
            try {
              localStorage.setItem(VIEW_PREFERENCE_KEY, mode);
            } catch {
              // Changing views does not depend on persistence being available.
            }
          }}
        />
        {!isScratchpad && !loading && !error && (
          <ModelDetails
            space={space}
            initialCalculatorId={initialCalculatorId}
            factsShown={factsShown}
            showCalculatorResults={showCalculatorResults}
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          />
        )}
        <main
          ref={mainRef}
          style={panelStyle}
          className={`${styles.main} ${resizing ? styles.panelResizing : ""}`}
        >
          <div
            ref={viewport}
            hidden={viewMode !== "canvas"}
            className={`${styles.canvas} ${
              areaMode && !spaceHeld
                ? styles.areaMode
                : spaceHeld
                ? styles.panMode
                : ""
            }`}
            role="region"
            aria-label="Model canvas"
            tabIndex={0}
            style={{
              backgroundSize: "24px 24px",
              backgroundPosition: `${view.x}px ${view.y}px`,
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
              if (event.pointerType === "touch") {
                lastTouchTime.current = Date.now();
                if (
                  pointers.current.size === 0 &&
                  !areaMode &&
                  !spaceHeld &&
                  !event.shiftKey &&
                  !(event.target as Element).closest(
                    "[data-node], [data-canvas-control]"
                  )
                ) {
                  touchTap.current = {
                    id: event.pointerId,
                    point: { x: event.clientX, y: event.clientY },
                    time: Date.now(),
                  };
                } else {
                  touchTap.current = null;
                  previousTouchTap.current = null;
                }
              }
              // Dragging captures the pointer on the canvas, which can also
              // retarget dblclick. Preserve the original hit before capture.
              canvasPointerStartedOnNode.current = !!(
                event.target as Element
              ).closest("[data-node]");
              event.currentTarget.dataset.pointerFocus = "true";
              if ((event.shiftKey || areaMode) && !spaceHeld)
                startPointer(event);
            }}
            onClickCapture={(event) => {
              if (
                suppressCanvasClick.current &&
                !(event.target as Element).closest("[data-canvas-control]")
              ) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            onPointerDown={startPointer}
            onPointerMove={movePointer}
            onPointerUp={endPointer}
            onPointerCancel={(event) => {
              touchTap.current = null;
              previousTouchTap.current = null;
              if (gesture.current?.kind === "select")
                setCanvasSelection(selectionBeforeGesture.current);
              setSelectionBox(null);
              dragRef.current = null;
              setDragPosition(null);
              gesture.current = null;
              pointers.current.clear();
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onDoubleClick={(event) => {
              // Touch taps are handled above; ignore compatibility mouse events.
              if (Date.now() - lastTouchTime.current < 700) return;
              if (
                !areaMode &&
                !event.shiftKey &&
                !suppressCanvasClick.current &&
                !canvasPointerStartedOnNode.current &&
                !(event.target as Element).closest(
                  "[data-node], [data-canvas-control]"
                )
              )
                add(toWorld(localPoint(event), viewRef.current));
            }}
          >
            <div
              className={styles.stage}
              style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
              }}
            >
              {viewMode === "canvas" && (
                <CanvasScene
                  metrics={metrics}
                  edges={space.edges || []}
                  selectedId={selectedId}
                  activeSelection={activeSelection}
                  simplified={simplified}
                  referenceMode={
                    space.canvasState.metricClickMode ===
                    "FUNCTION_INPUT_SELECT"
                  }
                  positionOf={positionOf}
                  onSelect={select}
                  onMove={move}
                />
              )}
              {selectionBox && (
                <div
                  data-selection-box
                  className={styles.selectionBox}
                  aria-hidden="true"
                  style={{
                    left: Math.min(selectionBox.start.x, selectionBox.end.x),
                    top: Math.min(selectionBox.start.y, selectionBox.end.y),
                    width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                    height: Math.abs(selectionBox.end.y - selectionBox.start.y),
                  }}
                />
              )}
            </div>
            <CanvasControls
              selectionCount={canvasActionIds.length}
              nodeCount={metrics.length}
              loading={loading}
              error={error}
              areaMode={areaMode}
              setAreaMode={setAreaMode}
              help={help}
              setHelp={setHelp}
              canvasHeight={canvasHeight}
              isScratchpad={isScratchpad}
              simplified={simplified}
              zoomLevel={view.zoom}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={() => dispatch(changeWorkspaceHistory(spaceId, false))}
              onRedo={() => dispatch(changeWorkspaceHistory(spaceId, true))}
              onClear={() => {
                setCanvasSelection([]);
                closeDetails();
              }}
              add={add}
              duplicateSelection={duplicateSelection}
              remove={remove}
              load={load}
              download={download}
              zoom={zoom}
              resetZoom={resetZoom}
              fit={fit}
            />
          </div>
          <SheetView
            active={viewMode === "sheet"}
            metrics={metrics}
            edges={space.edges || []}
            selectedId={selectedId}
            referenceMode={
              space.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT"
            }
            loading={loading}
            error={error}
            canUndo={canUndo}
            canRedo={canRedo}
            onSelect={select}
            onClear={closeDetails}
            onAdd={addSheetNode}
            onMove={(id, location) => dispatch(changeMetric({ id, location }))}
            onDelete={remove}
            onMoveNodes={(ids, delta) =>
              dispatch(moveWorkspaceNodes(ids, delta, spaceId))
            }
            onDuplicateNodes={(ids) =>
              dispatch(duplicateWorkspaceNodes(ids, spaceId))
            }
            onDeleteNodes={(ids) => {
              dispatch(removeMetrics(ids));
              closeDetails();
            }}
            onUndo={() => dispatch(changeWorkspaceHistory(spaceId, false))}
            onRedo={() => dispatch(changeWorkspaceHistory(spaceId, true))}
            onRetry={load}
            onDownload={download}
          />
          {selected && (
            <NodeInspector
              key={selected.id}
              metric={selected}
              surface={viewMode}
              resizeHandle={resizeHandle}
              focusFormula={formulaFocusId === selected.id}
              onAdvance={viewMode === "sheet" ? advanceSheetInput : undefined}
              metrics={metrics}
              onClose={closeDetails}
              onSelect={setSelectedId}
              canUseOrganizationFacts={canUseOrganizationFacts(space)}
              onDelete={remove}
            />
          )}
        </main>
        <div className={styles.liveStatus} role="status" aria-live="polite">
          {selected ? `Selected ${selected.name || selected.readableId}` : ""}
        </div>
      </div>
    </>
  );
}
