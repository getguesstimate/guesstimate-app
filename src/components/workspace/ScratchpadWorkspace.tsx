import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { ErrorModal } from "~/components/layout/ErrorModal";
import { ModalContainer } from "~/modules/modal/routes";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { denormalizedSpaceSelector } from "~/components/spaces/denormalized-space-selector";
import {
  loadScratchpad,
  addScratchpadNode,
} from "~/modules/scratchpad/actions";
import { SCRATCHPAD_ID } from "~/modules/scratchpad/model";
import { changeMetric, removeMetrics } from "~/modules/metrics/actions";
import { undo, redo } from "~/modules/checkpoints/actions";
import { changeMetricClickMode } from "~/modules/canvas_state/actions";
import { CanvasNode } from "./CanvasNode";
import { NodeInspector } from "./NodeInspector";
import { usePanelResize } from "./usePanelResize";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { Icon } from "./Icon";
import {
  Point,
  Viewport,
  fitNodes,
  zoomAt,
  toWorld,
  connectionPath,
  NODE_WIDTH,
  NODE_HEIGHT,
} from "./geometry";
import styles from "./workspace.module.css";

type Gesture =
  | { kind: "pan" | "node"; start: Point; origin: Point; id?: string }
  | { kind: "pinch"; distance: number; midpoint: Point; view: Viewport };
const isField = (target: EventTarget | null) =>
  target instanceof Element &&
  !!target.closest('input, textarea, select, [contenteditable="true"]');

export function ScratchpadWorkspace() {
  const { mainRef, panelStyle, resizeHandle, resizing } = usePanelResize();
  const dispatch = useAppDispatch();
  const { denormalizedSpace: space } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId: SCRATCHPAD_ID })
  );
  const metrics = space.metrics || [];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [hand, setHand] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [view, setViewState] = useState<Viewport>({ x: 80, y: 100, zoom: 1 });
  const viewRef = useRef(view);
  const setView = (next: Viewport) => {
    viewRef.current = next;
    setViewState(next);
  };
  const [dragPosition, setDragPosition] = useState<{
    id: string;
    point: Point;
  } | null>(null);
  const dragRef = useRef<typeof dragPosition>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const fitted = useRef(false);
  const selected = metrics.find((m) => m.id === selectedId);
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    dispatch(loadScratchpad())
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [dispatch]);
  useEffect(load, [load]);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wasHidden = document.body.classList.contains("remove-elev");
    document.body.classList.add("remove-elev");
    return () => {
      document.body.style.overflow = oldOverflow;
      if (!wasHidden) document.body.classList.remove("remove-elev");
      dispatch(changeMetricClickMode("DEFAULT"));
    };
  }, [dispatch]);

  const positionOf = (metric: (typeof metrics)[number]): Point =>
    dragPosition?.id === metric.id
      ? dragPosition.point
      : metric.canvasPosition || {
          x: metric.location.column * 350,
          y: metric.location.row * 230,
        };
  const fit = useCallback(() => {
    const box = viewport.current;
    if (!box) return;
    setView(
      fitNodes(
        metricsRef.current.map(
          (m) =>
            m.canvasPosition || {
              x: m.location.column * 350,
              y: m.location.row * 230,
            }
        ),
        box.clientWidth,
        box.clientHeight
      )
    );
  }, []);
  useEffect(() => {
    if (!loading && !error && metrics.length && !fitted.current) {
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
  }, [loading, error, metrics.length, fit]);

  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;
  useEffect(() => {
    const box = viewport.current;
    if (!box) return;
    const keepVisible = () => {
      const metric = metricsRef.current.find(
        (m) => m.id === selectedRef.current
      );
      if (!metric) return;
      const position = metric.canvasPosition || {
        x: metric.location.column * 350,
        y: metric.location.row * 230,
      };
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
  }, [selectedId]);

  const select = (id: string) => {
    if (space.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT") {
      window.dispatchEvent(
        new CustomEvent("functionMetricClicked", {
          detail: metrics.find((m) => m.id === id),
        })
      );
      return;
    }
    setSelectedId(id);
  };
  const closeDetails = () => {
    setSelectedId(null);
    dispatch(changeMetricClickMode("DEFAULT"));
  };
  const move = (id: string, point: Point) =>
    dispatch(changeMetric({ id, canvasPosition: point }));
  const remove = () => {
    if (selectedId) {
      dispatch(removeMetrics([selectedId]));
      closeDetails();
      viewport.current?.focus();
    }
  };
  const add = (point?: Point) => {
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
    setSelectedId(dispatch(addScratchpadNode(position)));
    setHand(false);
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
    const box = viewport.current;
    if (!box) return;
    const wheel = (event: WheelEvent) => {
      if ((event.target as Element).closest("[data-canvas-control]")) return;
      event.preventDefault();
      const v = viewRef.current;
      const scale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
          ? box.clientHeight
          : 1;
      const rect = box.getBoundingClientRect();
      // Trackpad pinch events use Ctrl and much smaller wheel deltas.
      const sensitivity = event.ctrlKey ? 0.01 : 0.002;
      setView(
        zoomAt(
          v,
          { x: event.clientX - rect.left, y: event.clientY - rect.top },
          v.zoom * Math.exp(-event.deltaY * scale * sensitivity)
        )
      );
    };
    box.addEventListener("wheel", wheel, { passive: false });
    return () => box.removeEventListener("wheel", wheel);
  }, []);

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
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        dispatch(event.shiftKey ? redo(SCRATCHPAD_ID) : undo(SCRATCHPAD_ID));
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        dispatch(redo(SCRATCHPAD_ID));
      }
      if (event.target !== viewport.current) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        remove();
      }
      if (event.key.toLowerCase() === "n" && !event.ctrlKey && !event.metaKey)
        add();
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
    if (event.button !== 0 && event.button !== 1) return;
    const target = event.target as Element;
    if (target.closest("[data-canvas-control]")) return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 2) {
      commitDrag();
      gesture.current = {
        kind: "pinch",
        ...pinchData(),
        view: viewRef.current,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    const dragId = target
      .closest("[data-drag-node]")
      ?.getAttribute("data-drag-node");
    if (dragId && !hand && !spaceHeld && event.button === 0) {
      const metric = metrics.find((m) => m.id === dragId)!;
      gesture.current = {
        kind: "node",
        id: dragId,
        start: point,
        origin: positionOf(metric),
      };
    } else if (
      !target.closest("[data-node]") ||
      hand ||
      spaceHeld ||
      event.button === 1
    ) {
      gesture.current = { kind: "pan", start: point, origin: viewRef.current };
      event.currentTarget.focus();
    } else return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    const point = localPoint(event);
    pointers.current.set(event.pointerId, point);
    const current = gesture.current;
    if (!current) return;
    if (current.kind === "pinch" && pointers.current.size >= 2) {
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
    } else if (current.kind === "pan")
      setView({
        ...viewRef.current,
        x: current.origin.x + point.x - current.start.x,
        y: current.origin.y + point.y - current.start.y,
      });
    else if (current.kind === "node") {
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
    pointers.current.delete(event.pointerId);
    commitDrag();
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointers.current.size === 1) {
      const point = [...pointers.current.values()][0];
      gesture.current = { kind: "pan", start: point, origin: viewRef.current };
    }
  };

  const download = () => {
    const graph = {
      name: "Scratchpad",
      metrics: metrics.map(
        ({ id, name, readableId, location, canvasPosition }) => ({
          id,
          name,
          readableId,
          location,
          canvasPosition,
        })
      ),
      guesstimates: metrics.map((m) => m.guesstimate),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(graph, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "scratchpad.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const canUndo =
    space.checkpointMetadata.head < space.checkpointMetadata.length - 1;
  const canRedo = space.checkpointMetadata.head > 0;
  return (
    <div className={styles.workspace}>
      <Head>
        <title key="title">Scratchpad — Guesstimate</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <ErrorModal />
      <ModalContainer />
      <WorkspaceHeader />
      <main
        ref={mainRef}
        style={panelStyle}
        className={`${styles.main} ${resizing ? styles.panelResizing : ""}`}
      >
        <div
          ref={viewport}
          className={`${styles.canvas} ${
            hand || spaceHeld ? styles.panMode : ""
          }`}
          role="region"
          aria-label="Model canvas"
          tabIndex={0}
          style={{
            backgroundSize: `${24 * view.zoom}px ${24 * view.zoom}px`,
            backgroundPosition: `${view.x}px ${view.y}px`,
          }}
          onPointerDown={startPointer}
          onPointerMove={movePointer}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={(event) => {
            if (
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
              {(space.edges || []).map((edge) => {
                const from = metrics.find((m) => m.id === edge.input),
                  to = metrics.find((m) => m.id === edge.output);
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
                key={metric.id}
                metric={metric}
                selected={selectedId === metric.id}
                referenceMode={
                  space.canvasState.metricClickMode === "FUNCTION_INPUT_SELECT"
                }
                position={positionOf(metric)}
                onSelect={() => select(metric.id)}
                onMove={(point) => move(metric.id, point)}
              />
            ))}
          </div>
          <div
            data-canvas-control
            className={styles.toolbar}
            role="toolbar"
            aria-label="Canvas tools"
          >
            <button
              type="button"
              className={styles.addButton}
              onClick={() => add()}
              disabled={loading || error}
            >
              <Icon name="plus" />
              <span>Add node</span>
            </button>
            <span className={styles.divider} />
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Select nodes"
              aria-pressed={!hand}
              onClick={() => setHand(false)}
              title="Select nodes"
            >
              <Icon name="cursor" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Pan canvas"
              aria-pressed={hand}
              onClick={() => setHand(true)}
              title="Pan canvas"
            >
              <Icon name="hand" />
            </button>
            <span className={styles.divider} />
            <button
              type="button"
              className={styles.iconButton}
              disabled={!canUndo}
              aria-label="Undo"
              title="Undo (Ctrl/⌘ Z)"
              onClick={() => dispatch(undo(SCRATCHPAD_ID))}
            >
              <Icon name="undo" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              disabled={!canRedo}
              aria-label="Redo"
              title="Redo (Ctrl/⌘ Shift Z)"
              onClick={() => dispatch(redo(SCRATCHPAD_ID))}
            >
              <Icon name="redo" />
            </button>
          </div>
          {(loading || error) && (
            <div
              data-canvas-control
              className={styles.canvasMessage}
              role={error ? "alert" : "status"}
            >
              {loading ? (
                <p>Loading scratchpad…</p>
              ) : (
                <>
                  <h2>Couldn’t load the example</h2>
                  <p>Check your connection and try again.</p>
                  <button
                    className={styles.signIn}
                    type="button"
                    onClick={load}
                  >
                    Try again
                  </button>
                </>
              )}
            </div>
          )}
          {!loading && !error && !metrics.length && (
            <div className={styles.canvasMessage}>
              <h2>Your canvas is empty</h2>
              <p>Add a node to start a calculation.</p>
            </div>
          )}
          <div data-canvas-control className={styles.canvasBottom}>
            <div className={styles.helpArea}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Canvas help"
                aria-expanded={help}
                onClick={() => setHelp(!help)}
              >
                <Icon name="help" />
              </button>
              <span className={styles.canvasHint}>
                Drag to pan · Scroll to zoom
              </span>
              {help && (
                <section
                  className={styles.helpPopover}
                  aria-label="Canvas help"
                >
                  <div className={styles.panelHeading}>
                    <h2>Working in the scratchpad</h2>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label="Close help"
                      onClick={() => setHelp(false)}
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                  <p>
                    Changes stay here until you reload. Download a copy before
                    leaving if you want to keep your work.
                  </p>
                  <ul>
                    <li>
                      Drag the background to pan. Scroll to zoom, or pinch on
                      touch screens.
                    </li>
                    <li>
                      Drag a node’s header to move it. Use arrow keys on a
                      focused grip for precise movement.
                    </li>
                    <li>Select a node to edit its value, formula, or notes.</li>
                    <li>
                      With the canvas focused: N adds a node, F fits the model,
                      and + / − zoom.
                    </li>
                  </ul>
                  <button
                    type="button"
                    className={styles.downloadButton}
                    onClick={download}
                    disabled={loading || error}
                  >
                    <Icon name="download" />
                    Download JSON
                  </button>
                  <a
                    href="https://docs.getguesstimate.com/docs/Introduction"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open documentation ↗
                  </a>
                </section>
              )}
            </div>
            <div
              className={styles.zoomControls}
              role="group"
              aria-label="Zoom controls"
            >
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Zoom out"
                onClick={() => zoom(1 / 1.2)}
              >
                <Icon name="minus" />
              </button>
              <button
                type="button"
                className={styles.zoomLabel}
                aria-label="Reset zoom to 100 percent"
                onClick={resetZoom}
              >
                {Math.round(view.zoom * 100)}%
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Zoom in"
                onClick={() => zoom(1.2)}
              >
                <Icon name="plus" />
              </button>
              <span className={styles.divider} />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Fit model to view"
                onClick={fit}
              >
                <Icon name="fit" />
              </button>
            </div>
          </div>
        </div>
        {selected && (
          <NodeInspector
            key={selected.id}
            metric={selected}
            resizeHandle={resizeHandle}
            metrics={metrics}
            onClose={closeDetails}
            onSelect={setSelectedId}
            onDelete={remove}
          />
        )}
      </main>
      <div className={styles.liveStatus} role="status" aria-live="polite">
        {selected ? `Selected ${selected.name || selected.readableId}` : ""}
      </div>
    </div>
  );
}
