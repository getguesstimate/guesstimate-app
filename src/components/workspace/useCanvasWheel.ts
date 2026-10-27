import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useAppDispatch } from "~/modules/hooks";
import { registerGraphChange } from "~/modules/spaces/actions";
import type { FullDenormalizedMetric } from "~/lib/engine/space";
import {
  canvasGridPosition,
  zoomAt,
  type Point,
  type Viewport,
} from "./geometry";
import type { CanvasGesture } from "./canvasTypes";
type Options = {
  spaceId: number;
  viewport: RefObject<HTMLDivElement | null>;
  metricsRef: RefObject<FullDenormalizedMetric[]>;
  selectionRef: RefObject<string[]>;
  gesture: RefObject<CanvasGesture | null>;
  viewRef: RefObject<Viewport>;
  setView(view: Viewport): void;
};
export function useCanvasWheel({
  spaceId,
  viewport,
  metricsRef,
  selectionRef,
  gesture,
  viewRef,
  setView,
}: Options) {
  const dispatch = useAppDispatch();
  const [spacingPositions, setSpacingPositions] = useState<
    Record<string, Point>
  >({});
  const spacingGesture = useRef<{
    originals: Record<string, Point>;
    positions: Record<string, Point>;
    center: Point;
    factor: number;
  } | null>(null);
  const spacingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitSpacing = useCallback(() => {
    if (spacingTimer.current) clearTimeout(spacingTimer.current);
    spacingTimer.current = null;
    const pending = spacingGesture.current;
    if (!pending) return;
    spacingGesture.current = null;
    if (
      Object.entries(pending.positions).some(
        ([id, p]) =>
          Math.abs(p.x - pending.originals[id].x) > 0.001 ||
          Math.abs(p.y - pending.originals[id].y) > 0.001
      )
    ) {
      for (const [id, canvasPosition] of Object.entries(pending.positions)) {
        dispatch({ type: "CHANGE_METRIC", item: { id, canvasPosition } });
      }
      dispatch(registerGraphChange(spaceId));
    }
    setSpacingPositions({});
  }, [dispatch, spaceId]);
  useEffect(() => {
    const keyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") commitSpacing();
    };
    // Commit before selection changes, edits, or Undo can start another action.
    window.addEventListener("pointerdown", commitSpacing, true);
    window.addEventListener("keydown", commitSpacing, true);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", commitSpacing);
    return () => {
      window.removeEventListener("pointerdown", commitSpacing, true);
      window.removeEventListener("keydown", commitSpacing, true);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", commitSpacing);
      commitSpacing();
    };
  }, [commitSpacing]);
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
      const selected = metricsRef.current.filter((m) =>
        selectionRef.current.includes(m.id)
      );
      if (event.shiftKey && selected.length > 1 && !gesture.current) {
        // Some browsers convert Shift + vertical wheel to horizontal deltas.
        const delta = (event.deltaY || event.deltaX) * scale;
        if (!delta) return;
        if (!spacingGesture.current) {
          const originals = Object.fromEntries(
            selected.map((m) => [
              m.id,
              m.canvasPosition || canvasGridPosition(m.location),
            ])
          );
          const points = Object.values(originals);
          spacingGesture.current = {
            originals,
            positions: originals,
            center: {
              x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
              y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
            },
            factor: 1,
          };
        }
        const pending = spacingGesture.current;
        pending.factor = Math.max(
          0.1,
          Math.min(
            10,
            pending.factor * Math.exp(Math.max(-1, Math.min(1, delta * 0.002)))
          )
        );
        pending.positions = Object.fromEntries(
          Object.entries(pending.originals).map(([id, p]) => [
            id,
            {
              x: pending.center.x + (p.x - pending.center.x) * pending.factor,
              y: pending.center.y + (p.y - pending.center.y) * pending.factor,
            },
          ])
        );
        setSpacingPositions(pending.positions);
        if (spacingTimer.current) clearTimeout(spacingTimer.current);
        spacingTimer.current = setTimeout(commitSpacing, 300);
        return;
      }
      commitSpacing();
      const rect = box.getBoundingClientRect();
      // Trackpad pinch events use Ctrl and much smaller wheel deltas.
      const sensitivity = event.ctrlKey ? 0.01 : 0.002;
      setView(
        zoomAt(
          v,
          { x: event.clientX - rect.left, y: event.clientY - rect.top },
          v.zoom *
            Math.exp(-(event.deltaY || event.deltaX) * scale * sensitivity)
        )
      );
    };
    box.addEventListener("wheel", wheel, { passive: false });
    return () => box.removeEventListener("wheel", wheel);
  }, [commitSpacing, gesture, metricsRef, selectionRef, setView, viewRef, viewport]);

  return { spacingPositions, commitSpacing };
}
