import { duplicateNodes } from "./duplicate";
import { Metric } from "~/modules/metrics/reducer";
const metrics: Metric[] = [
  { id: "a", readableId: "AA", space: -1, location: { row: 0, column: 0 }, canvasPosition: { x: 10, y: 30 } },
  { id: "b", readableId: "BB", space: -1, location: { row: 1, column: 0 }, canvasPosition: { x: 410, y: 50 } },
  { id: "external", readableId: "CC", space: -1, location: { row: 1, column: 1 } },
];
it("preserves layouts, notes and custom data while remapping only copied dependencies", () => {
  const data = [10, 20];
  const result = duplicateNodes(metrics, [
    { metric: "a", expression: "", description: "**note**", data, guesstimateType: "DATA" },
    { metric: "b", expression: "${metric:a} + ${metric:external}", description: "formula" },
  ], ["a", "b"]);
  const [a, b] = result.metrics;
  expect(a.location).toEqual({ row: 0, column: 2 });
  expect(b.location).toEqual({ row: 1, column: 2 });
  expect(b.canvasPosition!.x - a.canvasPosition!.x).toBe(400);
  expect(b.canvasPosition!.y - a.canvasPosition!.y).toBe(20);
  expect(result.guesstimates[1].expression).toBe(`\${metric:${a.id}} + \${metric:external}`);
  expect(result.guesstimates[0].description).toBe("**note**");
  expect(result.guesstimates[0].data).toEqual(data);
  expect(result.guesstimates[0].data).not.toBe(data);
  expect(new Set([...metrics, ...result.metrics].map(m => m.readableId)).size).toBe(5);
  expect(metrics[0].location.column).toBe(0);
});
it("repeated duplication finds vacant space and assigns new identities", () => {
  const first = duplicateNodes(metrics, [], ["a"]);
  const second = duplicateNodes([...metrics, ...first.metrics], [], ["a"]);
  expect(second.metrics[0].location.column).toBeGreaterThan(first.metrics[0].location.column);
  expect(second.metrics[0].id).not.toBe(first.metrics[0].id);
});
it("ignores stale selections", () => {
  expect(duplicateNodes(metrics, [], ["missing"]).metrics).toEqual([]);
});
