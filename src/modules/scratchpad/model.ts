import { canvasGridPosition } from "~/components/workspace/geometry";
import { Metric } from "~/modules/metrics/reducer";
import { Guesstimate } from "~/modules/guesstimates/reducer";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";

// Negative IDs are reserved for temporary client-side models.
export const SCRATCHPAD_ID = -1;
export const SCRATCHPAD_TEMPLATE_ID = 5170;

export function createScratchpad(template: ApiSpace): ApiSpace {
  const graph = template.graph as unknown as {
    metrics: Metric[];
    guesstimates: Guesstimate[];
  };
  const ids = new Map<string, string>(
    graph.metrics.map((m) => [m.id, `scratchpad-${m.id}`])
  );
  const depths = new Map<string, number>();
  const depth = (id: string, visiting = new Set<string>()): number => {
    if (visiting.has(id)) return 0;
    if (depths.has(id)) return depths.get(id)!;
    const expression =
      graph.guesstimates.find((g) => g.metric === id)?.expression || "";
    const inputs = graph.metrics.filter(
      (m) => m.id !== id && expression.includes(m.id)
    );
    const next = new Set(visiting).add(id);
    const value = inputs.length
      ? 1 + Math.max(...inputs.map((m) => depth(m.id, next)))
      : 0;
    depths.set(id, value);
    return value;
  };
  const rows = new Map<number, number>();
  const metrics = graph.metrics.map((m) => {
    const column = depth(m.id);
    const row = rows.get(column) || 0;
    rows.set(column, row + 1);
    return {
      ...m,
      id: ids.get(m.id),
      space: SCRATCHPAD_ID,
      location: { row, column },
      canvasPosition: canvasGridPosition({ column, row }),
    };
  });
  const guesstimates = graph.guesstimates.map((g) => {
    let expression = g.expression || "";
    for (const [oldId, newId] of ids)
      expression = expression.split(oldId).join(newId);
    return { ...g, metric: ids.get(g.metric), expression };
  });
  return {
    ...template,
    id: SCRATCHPAD_ID,
    graph: { metrics, guesstimates } as unknown as ApiSpace["graph"],
  };
}
