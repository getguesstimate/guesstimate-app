export type Point = { x: number; y: number };
export type Viewport = Point & { zoom: number };
export const NODE_WIDTH = 252;
export const NODE_HEIGHT = 184;
export const CANVAS_COLUMN_STEP = NODE_WIDTH + 46;
export const CANVAS_ROW_STEP = NODE_HEIGHT + 46;
export const canvasGridPosition = ({
  column,
  row,
}: {
  column: number;
  row: number;
}): Point => ({
  x: column * CANVAS_COLUMN_STEP,
  y: row * CANVAS_ROW_STEP,
});
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2;

export const clampZoom = (zoom: number) =>
  Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

export const toWorld = (point: Point, view: Viewport): Point => ({
  x: (point.x - view.x) / view.zoom,
  y: (point.y - view.y) / view.zoom,
});

export function zoomAt(view: Viewport, point: Point, zoom: number): Viewport {
  const nextZoom = clampZoom(zoom);
  const world = toWorld(point, view);
  return {
    x: point.x - world.x * nextZoom,
    y: point.y - world.y * nextZoom,
    zoom: nextZoom,
  };
}

export function fitNodes(
  points: Point[],
  width: number,
  height: number
): Viewport {
  if (!points.length) return { x: width / 2, y: height / 2, zoom: 1 };
  const left = Math.min(...points.map((p) => p.x));
  const top = Math.min(...points.map((p) => p.y));
  const right = Math.max(...points.map((p) => p.x)) + NODE_WIDTH;
  const bottom = Math.max(...points.map((p) => p.y)) + NODE_HEIGHT;
  const zoom = clampZoom(
    Math.min(1, (width - 100) / (right - left), (height - 120) / (bottom - top))
  );
  return {
    x: (width - (right - left) * zoom) / 2 - left * zoom,
    y: (height - (bottom - top) * zoom) / 2 - top * zoom,
    zoom,
  };
}

export function connectionPath(from: Point, to: Point) {
  const horizontal = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);
  if (horizontal) {
    const forward = to.x >= from.x;
    const a = {
      x: from.x + (forward ? NODE_WIDTH : 0),
      y: from.y + NODE_HEIGHT / 2,
    };
    const b = {
      x: to.x + (forward ? 0 : NODE_WIDTH),
      y: to.y + NODE_HEIGHT / 2,
    };
    const bend = Math.max(50, Math.abs(b.x - a.x) / 2) * (forward ? 1 : -1);
    return `M ${a.x} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${
      b.x
    } ${b.y}`;
  }
  const forward = to.y >= from.y;
  const a = {
    x: from.x + NODE_WIDTH / 2,
    y: from.y + (forward ? NODE_HEIGHT : 0),
  };
  const b = { x: to.x + NODE_WIDTH / 2, y: to.y + (forward ? 0 : NODE_HEIGHT) };
  const bend = Math.max(50, Math.abs(b.y - a.y) / 2) * (forward ? 1 : -1);
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${
    b.x
  } ${b.y}`;
}
