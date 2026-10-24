import { Point } from "~/components/workspace/geometry";

export const EMBED_NODE_WIDTH = 200;
export type EmbedBox = Point & { height: number };
type LayoutNode = {
  id: string;
  location: { row: number; column: number };
  canvasPosition?: Point;
};

export function arrangeComposition(
  nodes: LayoutNode[],
  heights: Record<string, number>
) {
  const rowHeights = new Map<number, number>();
  for (const node of nodes) {
    if (!node.canvasPosition)
      rowHeights.set(
        node.location.row,
        Math.max(
          rowHeights.get(node.location.row) || 0,
          heights[node.id] || 110
        )
      );
  }
  const rows = [...rowHeights.keys()].sort((a, b) => a - b);
  const rowTops = new Map<number, number>();
  let y = 0;
  rows.forEach((row, i) => {
    if (i > 0) y += Math.max(0, row - rows[i - 1] - 1) * 130;
    rowTops.set(row, y);
    y += rowHeights.get(row)! + 20;
  });
  return new Map(
    nodes.map((node) => [
      node.id,
      {
        ...(node.canvasPosition || {
          x: node.location.column * (EMBED_NODE_WIDTH + 30),
          y: rowTops.get(node.location.row)!,
        }),
        height: node.canvasPosition
          ? heights[node.id] || 110
          : rowHeights.get(node.location.row)!,
      },
    ])
  );
}

// Keep a consistent reading size. The surface grows with the model, not vice versa.
export function frameComposition(
  points: EmbedBox[],
  width: number,
  height: number
) {
  const zoom = 0.93;
  const padding = width < 500 ? 20 : 32;
  if (!points.length) return { x: padding, y: padding, zoom, width, height };
  const left = Math.min(...points.map((p) => p.x));
  const top = Math.min(...points.map((p) => p.y));
  const contentWidth =
    Math.max(...points.map((p) => p.x)) + EMBED_NODE_WIDTH - left;
  const contentHeight = Math.max(...points.map((p) => p.y + p.height)) - top;
  return {
    x: padding - left * zoom,
    y: padding - top * zoom,
    zoom,
    width: Math.max(width, contentWidth * zoom + padding * 2),
    height: Math.max(height, contentHeight * zoom + padding * 2),
  };
}

export function embedConnectionPath(from: EmbedBox, to: EmbedBox) {
  const horizontal = Math.abs(to.x - from.x) > Math.abs(to.y - from.y);
  if (horizontal) {
    const forward = to.x >= from.x;
    const a = {
      x: from.x + (forward ? EMBED_NODE_WIDTH : 0),
      y: from.y + from.height / 2,
    };
    const b = {
      x: to.x + (forward ? 0 : EMBED_NODE_WIDTH),
      y: to.y + to.height / 2,
    };
    const bend = Math.max(20, Math.abs(b.x - a.x) / 2) * (forward ? 1 : -1);
    return `M ${a.x} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${
      b.x
    } ${b.y}`;
  }
  const forward = to.y >= from.y;
  const a = {
    x: from.x + EMBED_NODE_WIDTH / 2,
    y: from.y + (forward ? from.height : 0),
  };
  const b = {
    x: to.x + EMBED_NODE_WIDTH / 2,
    y: to.y + (forward ? 0 : to.height),
  };
  const bend = Math.max(16, Math.abs(b.y - a.y) / 2) * (forward ? 1 : -1);
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${
    b.x
  } ${b.y}`;
}
