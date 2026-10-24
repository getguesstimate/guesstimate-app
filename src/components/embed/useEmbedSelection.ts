import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { type EmbedBox, EMBED_NODE_WIDTH } from "./layout";

type Point = { x: number; y: number };
type Gesture = {
  pointerId: number;
  start: Point;
  origin: Point;
  zoom: number;
  selection: string[];
  offsets: Record<string, Point>;
  moving: string[] | null;
  moved: boolean;
};

export function useEmbedSelection(
  positions: Map<string, EmbedBox>,
  view: { x: number; y: number; zoom: number }
) {
  const [selection, setSelection] = useState<string[]>([]);
  const [offsets, setOffsets] = useState<Record<string, Point>>({});
  const [marquee, setMarquee] = useState<
    (Point & { width: number; height: number }) | null
  >(null);
  const gesture = useRef<Gesture | null>(null);
  const pan = useRef<{
    pointerId: number;
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const [panning, setPanning] = useState(false);
  const suppressClickUntil = useRef(0);
  const point = (event: PointerEvent<HTMLElement>) => {
    const frame = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - frame.left + event.currentTarget.scrollLeft,
      y: event.clientY - frame.top + event.currentTarget.scrollTop,
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || gesture.current || pan.current) return;
    if (event.button === 1) {
      pan.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        left: event.currentTarget.scrollLeft,
        top: event.currentTarget.scrollTop,
      };
      setPanning(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    const corner = target.closest("[data-embed-corner]");
    const node = target.closest<HTMLElement>("[data-embed-node]");
    if (node && !corner) return;
    if (!node && (target.closest("button, a") || event.pointerType === "touch"))
      return;
    const id = node?.dataset.embedNode;
    const moving = id
      ? selection.includes(id)
        ? selection
        : event.shiftKey
        ? [...selection, id]
        : [id]
      : null;
    gesture.current = {
      pointerId: event.pointerId,
      start: point(event),
      origin: { x: view.x, y: view.y },
      zoom: view.zoom,
      selection,
      offsets,
      moving,
      moved: false,
    };
    if (moving) setSelection(moving);
    else if (!event.shiftKey) setSelection([]);
    if (!moving) gesture.current.selection = event.shiftKey ? selection : [];
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    node?.focus();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pan.current?.pointerId === event.pointerId) {
      event.currentTarget.scrollLeft =
        pan.current.left - (event.clientX - pan.current.x);
      event.currentTarget.scrollTop =
        pan.current.top - (event.clientY - pan.current.y);
      return;
    }
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const end = point(event);
    const dx = (end.x - current.start.x) / current.zoom;
    const dy = (end.y - current.start.y) / current.zoom;
    if (!current.moved && Math.hypot(dx, dy) < 4) return;
    current.moved = true;
    if (current.moving) {
      // Keep the surface origin fixed while dragging, including at its edges.
      const minX = Math.min(
        ...current.moving.map(
          (id) => positions.get(id)!.x + (current.offsets[id]?.x || 0)
        )
      );
      const minY = Math.min(
        ...current.moving.map(
          (id) => positions.get(id)!.y + (current.offsets[id]?.y || 0)
        )
      );
      const x = Math.max(dx, -current.origin.x / current.zoom - minX);
      const y = Math.max(dy, -current.origin.y / current.zoom - minY);
      setOffsets({
        ...current.offsets,
        ...Object.fromEntries(
          current.moving.map((id) => [
            id,
            {
              x: (current.offsets[id]?.x || 0) + x,
              y: (current.offsets[id]?.y || 0) + y,
            },
          ])
        ),
      });
    } else {
      const box = {
        x: (Math.min(current.start.x, end.x) - current.origin.x) / current.zoom,
        y: (Math.min(current.start.y, end.y) - current.origin.y) / current.zoom,
        width: Math.abs(end.x - current.start.x) / current.zoom,
        height: Math.abs(end.y - current.start.y) / current.zoom,
      };
      setMarquee(box);
      const hits = [...positions]
        .filter(([id, p]) => {
          const x = p.x + (offsets[id]?.x || 0),
            y = p.y + (offsets[id]?.y || 0);
          return (
            x < box.x + box.width &&
            x + EMBED_NODE_WIDTH > box.x &&
            y < box.y + box.height &&
            y + p.height > box.y
          );
        })
        .map(([id]) => id);
      setSelection([...new Set([...current.selection, ...hits])]);
    }
  };

  const finish = (event: PointerEvent<HTMLDivElement>, cancel = false) => {
    if (pan.current?.pointerId === event.pointerId) {
      pan.current = null;
      setPanning(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      return;
    }
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (cancel) {
      setOffsets(current.offsets);
      setSelection(current.selection);
    }
    if (current.moved) suppressClickUntil.current = Date.now() + 400;
    gesture.current = null;
    setMarquee(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return {
    selection,
    offsets,
    marquee,
    panning,
    select(id: string, additive: boolean) {
      if (Date.now() < suppressClickUntil.current) return;
      setSelection((previous) =>
        additive
          ? previous.includes(id)
            ? previous.filter((value) => value !== id)
            : [...previous, id]
          : [id]
      );
    },
    clear: () => setSelection([]),
    canOpen: () => Date.now() >= suppressClickUntil.current,
    handlers: {
      onAuxClick: (event: MouseEvent<HTMLDivElement>) => {
        if (event.button === 1) event.preventDefault();
      },
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finish(event),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) =>
        finish(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) =>
        finish(event, true),
    },
  };
}
