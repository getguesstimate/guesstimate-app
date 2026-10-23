import { createScratchpad, SCRATCHPAD_ID } from "./model";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import { equals } from "~/lib/engine/metric";
import { Metric } from "~/modules/metrics/reducer";

it("isolates the scratchpad from its shared source and remaps formula dependencies", () => {
  const template = {
    id: 5170,
    graph: {
      metrics: [
        { id: "input", readableId: "A", location: { row: 0, column: 0 } },
        { id: "result", readableId: "B", location: { row: 1, column: 0 } },
      ],
      guesstimates: [
        { metric: "input", expression: "40 to 60" },
        { metric: "result", expression: "${metric:input} * 80" },
      ],
    },
  };
  const copy = createScratchpad(template as unknown as ApiSpace);
  const graph = copy.graph as any;
  expect(copy.id).toBe(SCRATCHPAD_ID);
  expect(graph.metrics[0].id).not.toBe("input");
  expect(graph.guesstimates[1].expression).toBe(
    "${metric:scratchpad-input} * 80"
  );
  expect(graph.metrics[1].canvasPosition.x).toBeGreaterThan(
    graph.metrics[0].canvasPosition.x
  );
  expect(graph.metrics[0].location).toEqual({ row: 0, column: 0 });
  expect(graph.metrics[1].location).toEqual({ row: 0, column: 1 });
  expect(template.graph.metrics[1].location).toEqual({ row: 1, column: 0 });
  expect(template.graph.metrics[0]).not.toHaveProperty("canvasPosition");
  expect(template.graph.guesstimates[1].expression).toBe(
    "${metric:input} * 80"
  );
});

it("recognizes freeform position changes when restoring undo history", () => {
  const before: Metric = {
    id: "a",
    space: -1,
    readableId: "A",
    location: { row: 0, column: 0 },
    canvasPosition: { x: 10, y: 20 },
  };
  expect(equals(before, { ...before, canvasPosition: { x: 11, y: 20 } })).toBe(
    false
  );
  expect(equals(before, { ...before, canvasPosition: { x: 10, y: 20 } })).toBe(
    true
  );
});
