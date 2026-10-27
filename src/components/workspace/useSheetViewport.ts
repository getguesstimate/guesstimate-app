import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FullDenormalizedMetric } from "~/lib/engine/space";
import {
  SHEET_COLUMN,
  SHEET_ROW,
  SHEET_GUTTER,
  SHEET_HEADING,
} from "./sheetGeometry";

// Sheet percentages are relative to this scale; geometry uses the actual scale.
export const SHEET_BASE_SCALE = 0.8;
export const MIN_SHEET_SCALE = SHEET_BASE_SCALE * 0.25;
export const MAX_SHEET_SCALE = SHEET_BASE_SCALE * 2;

export function useSheetViewport(
  metrics: FullDenormalizedMetric[],
  rowCount: number,
  handActive: boolean
) {
  const scroll = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(SHEET_BASE_SCALE);
  const zoomRef = useRef(SHEET_BASE_SCALE);
  const pendingScroll = useRef<{ x: number; y: number } | null>(null);
  const columnHeadings = useRef<HTMLDivElement>(null);
  const rowHeadings = useRef<HTMLDivElement>(null);
  const corner = useRef<HTMLDivElement>(null);
  const pinnedOffset = useRef({ x: NaN, y: NaN });
  const updatePinnedHeaders = () => {
    const box = scroll.current;
    if (!box) return;
    // Only the two header strips and corner move when scrolling; grid content
    // remains unchanged. Coordinates are in unscaled sheet units.
    const x = box.scrollLeft / zoom;
    const y = box.scrollTop / zoom;
    if (x !== pinnedOffset.current.x) {
      if (rowHeadings.current)
        rowHeadings.current.style.transform = `translateX(${x}px)`;
      if (corner.current) corner.current.style.transform = `translateX(${x}px)`;
    }
    if (y !== pinnedOffset.current.y && columnHeadings.current)
      columnHeadings.current.style.transform = `translateY(${y}px)`;
    pinnedOffset.current = { x, y };
  };
  const zoomTo = (value: number, x?: number, y?: number) => {
    const box = scroll.current;
    if (!box) return;
    const next = Math.max(MIN_SHEET_SCALE, Math.min(MAX_SHEET_SCALE, value));
    const anchorX = x ?? box.clientWidth / 2;
    const anchorY = y ?? box.clientHeight / 2;
    if (next === zoomRef.current) return;
    // Wheel events can arrive before React applies the preceding zoom.
    const currentScroll = pendingScroll.current ?? {
      x: box.scrollLeft,
      y: box.scrollTop,
    };
    pendingScroll.current = {
      x: ((currentScroll.x + anchorX) * next) / zoomRef.current - anchorX,
      y: ((currentScroll.y + anchorY) * next) / zoomRef.current - anchorY,
    };
    zoomRef.current = next;
    setZoom(next);
  };
  const applyPendingScroll = () => {
    // Only scroll once React has committed the matching scale. An animation
    // frame can run before that commit and visibly pan the still-unscaled sheet.
    if (zoom === zoomRef.current && pendingScroll.current && scroll.current) {
      scroll.current.scrollLeft = pendingScroll.current.x;
      scroll.current.scrollTop = pendingScroll.current.y;
      pendingScroll.current = null;
    }
  };
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
      const delta = event.deltaY * unit;
      // Keep Ctrl+wheel predictable across pixel-, line- and page-based mice.
      const exponent = event.ctrlKey
        ? Math.max(-0.12, Math.min(0.12, -delta * 0.001))
        : -delta * 0.002;
      zoomTo(
        zoomRef.current * Math.exp(exponent),
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    };
    box.addEventListener("wheel", wheel, { passive: false });
    return () => box.removeEventListener("wheel", wheel);
  }, [handActive]);
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
        SHEET_BASE_SCALE
      )
    );
    pendingScroll.current = {
      x: left * zoomRef.current,
      y: top * zoomRef.current,
    };
    applyPendingScroll();
  };
  useLayoutEffect(() => {
    pinnedOffset.current = { x: NaN, y: NaN };
  }, [rowCount]);
  useLayoutEffect(() => {
    applyPendingScroll();
    updatePinnedHeaders();
  });

  return {
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
  };
}
