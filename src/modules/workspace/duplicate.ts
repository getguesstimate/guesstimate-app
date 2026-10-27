import {
  canvasGridPosition,
  CANVAS_COLUMN_STEP,
  NODE_WIDTH,
  NODE_HEIGHT,
  type Point,
} from "~/components/workspace/geometry";
import { create as createMetric } from "~/lib/engine/metric";
import { Metric } from "~/modules/metrics/reducer";
import { Guesstimate } from "~/modules/guesstimates/reducer";
import {
  boundingRegion,
  isWithinRegion,
  move,
  type CanvasLocation,
  type Region,
} from "~/lib/locationUtils";

const canvasPosition = (metric: Metric) =>
  metric.canvasPosition || canvasGridPosition(metric.location);

function findCanvasDuplicateOffset(points: Point[], selected: Point[]) {
  const gap = CANVAS_COLUMN_STEP - NODE_WIDTH;
  const start = {
    x: Math.min(...selected.map((p) => p.x)),
    y: Math.min(...selected.map((p) => p.y)),
  };
  const end = {
    x: Math.max(...selected.map((p) => p.x)) + NODE_WIDTH,
    y: Math.max(...selected.map((p) => p.y)) + NODE_HEIGHT,
  };
  const width = end.x - start.x;
  const height = end.y - start.y;
  const axis = selected.length > 1 && width > height ? "y" : "x";
  const crossAxis = axis === "x" ? "y" : "x";
  const nodeSize = { x: NODE_WIDTH, y: NODE_HEIGHT };
  const groupSize = end[axis] - start[axis];
  const obstacles = points
    .filter(
      (p) =>
        p[crossAxis] < end[crossAxis] + gap &&
        p[crossAxis] + nodeSize[crossAxis] + gap > start[crossAxis]
    )
    .sort((a, b) => a[axis] - b[axis]);

  let destinationStart = end[axis] + gap;
  for (const obstacle of obstacles) {
    const obstacleEnd = obstacle[axis] + nodeSize[axis] + gap;
    if (obstacleEnd <= destinationStart) continue;
    if (obstacle[axis] >= destinationStart + groupSize + gap) break;
    destinationStart = obstacleEnd;
  }
  const offset = { x: 0, y: 0 };
  offset[axis] = destinationStart - start[axis];
  return offset;
}

function findSheetDuplicateOffset(
  metrics: Metric[],
  selected: Metric[]
): CanvasLocation {
  const [start, end] = boundingRegion(selected.map((m) => m.location));
  const width = end.column - start.column + 1;
  const height = end.row - start.row + 1;
  const axis = width > height ? "row" : "column";
  const offset = { row: 0, column: 0 };
  offset[axis] = end[axis] - start[axis] + 1;

  // Keep the entire copied block clear, including gaps within sparse groups.
  let destination: Region = [move(start, offset), move(end, offset)];
  while (metrics.some((m) => isWithinRegion(m.location, destination))) {
    offset[axis]++;
    destination = [move(start, offset), move(end, offset)];
  }
  return offset;
}

// Duplicate a group into a vacant block, preserving both layouts and internal links.
export function duplicateNodes(
  metrics: Metric[],
  guesses: Guesstimate[],
  ids: string[]
) {
  const selected = metrics.filter((m) => ids.includes(m.id));
  if (!selected.length) return { metrics: [], guesstimates: [] };
  const sheetOffset = findSheetDuplicateOffset(metrics, selected);
  const canvasOffset = findCanvasDuplicateOffset(
    metrics.map(canvasPosition),
    selected.map(canvasPosition)
  );
  const used = metrics.map((m) => m.readableId);
  const remap = new Map<string, string>();
  const copies = selected.map((m) => {
    const identity = createMetric(used);
    used.push(identity.readableId);
    remap.set(m.id, identity.id);
    const point = canvasPosition(m);
    return {
      ...m,
      ...identity,
      location: move(m.location, sheetOffset),
      canvasPosition: {
        x: point.x + canvasOffset.x,
        y: point.y + canvasOffset.y,
      },
    };
  });
  const guesstimates = selected.map((m) => {
    const g = guesses.find((g) => g.metric === m.id) || {
      metric: m.id,
      expression: "",
      description: "",
      guesstimateType: "NONE",
    };
    return {
      ...g,
      metric: remap.get(m.id)!,
      data: g.data ? [...g.data] : g.data,
      expression: (g.expression || "").replace(
        /\$\{metric:([^}]+)\}/g,
        (token, id: string) =>
          remap.has(id) ? `\${metric:${remap.get(id)}}` : token
      ),
    };
  });
  return { metrics: copies, guesstimates };
}
