import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { FullDenormalizedMetric } from "~/lib/engine/space";
import {
  canvasGridPosition,
  toWorld,
  NODE_WIDTH,
  NODE_HEIGHT,
  type Point,
  type Viewport,
} from "./geometry";
import type { CanvasGesture } from "./canvasTypes";
type Options = {
  viewport: RefObject<HTMLDivElement | null>;
  gesture: RefObject<CanvasGesture | null>;
  viewRef: RefObject<Viewport>;
  metricsRef: RefObject<FullDenormalizedMetric[]>;
  setView(view: Viewport): void;
  setCanvasSelection(ids: string[]): void;
};
export function useCanvasAreaSelection({
  viewport,
  gesture,
  viewRef,
  metricsRef,
  setView,
  setCanvasSelection,
}: Options) {
  const [selectionBox, setSelectionBox] = useState<{
    start: Point;
    end: Point;
  } | null>(null);
  const selectionPointer = useRef<Point | null>(null);
  const selectingArea = selectionBox !== null;
  const updateAreaSelection = useCallback(
    (start: Point, end: Point) => {
      setSelectionBox({ start, end });
      setCanvasSelection(
        metricsRef.current
          .filter((m) => {
            const p = m.canvasPosition || canvasGridPosition(m.location);
            return (
              p.x + NODE_WIDTH >= Math.min(start.x, end.x) &&
              p.x <= Math.max(start.x, end.x) &&
              p.y + NODE_HEIGHT >= Math.min(start.y, end.y) &&
              p.y <= Math.max(start.y, end.y)
            );
          })
          .map((m) => m.id)
      );
    },
    [metricsRef, setCanvasSelection]
  );
  useEffect(() => {
    if (!selectingArea) return;
    let frame = 0;
    let lastTime = performance.now();
    const tick = (time: number) => {
      const current = gesture.current;
      const point = selectionPointer.current;
      const box = viewport.current;
      if (!box || !point || current?.kind !== "select") return;
      const elapsed = Math.min(32, time - lastTime);
      lastTime = time;
      const speed = (coordinate: number, size: number) => {
        const edge = 36;
        const direction =
          coordinate < edge
            ? (edge - coordinate) / edge
            : coordinate > size - edge
            ? (size - edge - coordinate) / edge
            : 0;
        return Math.max(-1, Math.min(1, direction)) * elapsed * 0.7;
      };
      const dx = speed(point.x, box.clientWidth),
        dy = speed(point.y, box.clientHeight);
      if (dx || dy) {
        const next = {
          ...viewRef.current,
          x: viewRef.current.x + dx,
          y: viewRef.current.y + dy,
        };
        setView(next);
        updateAreaSelection(current.start, toWorld(point, next));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [selectingArea, gesture, setView, updateAreaSelection, viewRef, viewport]);

  return {
    selectionBox,
    setSelectionBox,
    selectionPointer,
    updateAreaSelection,
  };
}
