import { create as createMetric } from "~/lib/engine/metric";
import { Metric } from "~/modules/metrics/reducer";
import { Guesstimate } from "~/modules/guesstimates/reducer";

// Duplicate a group into a vacant block, preserving both layouts and internal links.
export function duplicateNodes(
  metrics: Metric[],
  guesses: Guesstimate[],
  ids: string[]
) {
  const selected = metrics.filter((m) => ids.includes(m.id));
  if (!selected.length) return { metrics: [], guesstimates: [] };
  const minColumn = Math.min(...selected.map((m) => m.location.column));
  const maxColumn = Math.max(...selected.map((m) => m.location.column));
  const minRow = Math.min(...selected.map((m) => m.location.row));
  const maxRow = Math.max(...selected.map((m) => m.location.row));
  let offset = maxColumn - minColumn + 1;
  while (
    metrics.some(
      (m) =>
        m.location.row >= minRow &&
        m.location.row <= maxRow &&
        m.location.column >= minColumn + offset &&
        m.location.column <= maxColumn + offset
    )
  )
    offset++;
  const position = (m: Metric) =>
    m.canvasPosition || { x: m.location.column * 350, y: m.location.row * 230 };
  const canvasOffset =
    Math.max(...metrics.map((m) => position(m).x)) -
    Math.min(...selected.map((m) => position(m).x)) +
    350;
  const used = metrics.map((m) => m.readableId);
  const remap = new Map<string, string>();
  const copies = selected.map((m) => {
    const identity = createMetric(used);
    used.push(identity.readableId);
    remap.set(m.id, identity.id);
    const point = position(m);
    return {
      ...m,
      ...identity,
      location: { ...m.location, column: m.location.column + offset },
      canvasPosition: { x: point.x + canvasOffset, y: point.y },
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
      expression: g.expression.replace(
        /\$\{metric:([^}]+)\}/g,
        (token, id: string) =>
          remap.has(id) ? `\${metric:${remap.get(id)}}` : token
      ),
    };
  });
  return { metrics: copies, guesstimates };
}
