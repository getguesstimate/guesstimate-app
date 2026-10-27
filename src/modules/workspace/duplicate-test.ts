import { duplicateNodes } from "./duplicate";
import { Metric } from "~/modules/metrics/reducer";
import {
  CANVAS_COLUMN_STEP,
  NODE_WIDTH,
} from "~/components/workspace/geometry";
const metrics: Metric[] = [
  {
    id: "a",
    readableId: "AA",
    space: -1,
    location: { row: 0, column: 0 },
    canvasPosition: { x: 10, y: 30 },
  },
  {
    id: "b",
    readableId: "BB",
    space: -1,
    location: { row: 1, column: 0 },
    canvasPosition: { x: 410, y: 50 },
  },
  {
    id: "external",
    readableId: "CC",
    space: -1,
    location: { row: 1, column: 1 },
  },
];
it("preserves layouts, notes and custom data while remapping only copied dependencies", () => {
  const data = [10, 20];
  const result = duplicateNodes(
    metrics,
    [
      {
        metric: "a",
        expression: "",
        description: "**note**",
        data,
        guesstimateType: "DATA",
      },
      {
        metric: "b",
        expression: "${metric:a} + ${metric:external}",
        description: "formula",
      },
    ],
    ["a", "b"]
  );
  const [a, b] = result.metrics;
  expect(a.location).toEqual({ row: 0, column: 2 });
  expect(b.location).toEqual({ row: 1, column: 2 });
  expect(b.canvasPosition!.x - a.canvasPosition!.x).toBe(400);
  expect(b.canvasPosition!.y - a.canvasPosition!.y).toBe(20);
  expect(result.guesstimates[1].expression).toBe(
    `\${metric:${a.id}} + \${metric:external}`
  );
  expect(result.guesstimates[0].description).toBe("**note**");
  expect(result.guesstimates[0].data).toEqual(data);
  expect(result.guesstimates[0].data).not.toBe(data);
  expect(
    new Set([...metrics, ...result.metrics].map((m) => m.readableId)).size
  ).toBe(5);
  expect(metrics[0].location.column).toBe(0);
});
it("repeated duplication finds vacant space and assigns new identities", () => {
  const first = duplicateNodes(metrics, [], ["a"]);
  const second = duplicateNodes([...metrics, ...first.metrics], [], ["a"]);
  expect(second.metrics[0].location.column).toBeGreaterThan(
    first.metrics[0].location.column
  );
  expect(second.metrics[0].id).not.toBe(first.metrics[0].id);
});
it("ignores stale selections", () => {
  expect(duplicateNodes(metrics, [], ["missing"]).metrics).toEqual([]);
});

const group = (cells: [number, number][]): Metric[] =>
  cells.map(([row, column], i) => ({
    id: `node-${i}`,
    readableId: `N${i}`,
    space: 12,
    location: { row, column },
  }));

it("uses free canvas space next to the selection despite distant nodes", () => {
  const nodes = group([
    [0, 0],
    [0, 20],
    [20, 1],
  ]);
  const copies = duplicateNodes(nodes, [], [nodes[0].id]);
  expect(copies.metrics[0].canvasPosition).toEqual({
    x: CANVAS_COLUMN_STEP,
    y: 0,
  });
});

it("skips nearby canvas obstacles and uses the gap before distant ones", () => {
  const nodes = group([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 20],
  ]);
  const copies = duplicateNodes(nodes, [], [nodes[0].id]);
  expect(copies.metrics[0].canvasPosition).toEqual({
    x: CANVAS_COLUMN_STEP * 3,
    y: 0,
  });
  const repeated = duplicateNodes(
    [...nodes, ...copies.metrics],
    [],
    [nodes[0].id]
  );
  expect(repeated.metrics[0].canvasPosition!.x).toBe(CANVAS_COLUMN_STEP * 4);
});

it("fits the whole canvas group and preserves its relative positions", () => {
  const nodes = group([
    [0, 0],
    [1, 0],
    [0, 1],
    [0, 20],
  ]);
  nodes[0].canvasPosition = { x: -100, y: -50 };
  nodes[1].canvasPosition = { x: 0, y: 200 };
  nodes[2].canvasPosition = { x: 400, y: 250 };
  const copies = duplicateNodes(
    nodes,
    [],
    nodes.slice(0, 2).map((m) => m.id)
  );
  const gap = CANVAS_COLUMN_STEP - NODE_WIDTH;
  expect(copies.metrics.map((m) => m.canvasPosition)).toEqual([
    { x: 400 + NODE_WIDTH + gap, y: -50 },
    { x: 500 + NODE_WIDTH + gap, y: 200 },
  ]);
});

it("uses actual canvas positions to duplicate wide groups below", () => {
  const nodes = group([
    [0, 0],
    [1, 0],
  ]);
  nodes[0].canvasPosition = { x: -100, y: -50 };
  nodes[1].canvasPosition = { x: 250, y: -50 };
  const copies = duplicateNodes(
    nodes,
    [],
    nodes.map((m) => m.id)
  );
  expect(copies.metrics.map((m) => m.canvasPosition)).toEqual([
    { x: -100, y: 180 },
    { x: 250, y: 180 },
  ]);
});

it("skips obstacles below a canvas group without jumping past distant nodes", () => {
  const nodes = group([
    [0, 0],
    [0, 1],
    [1, 0],
    [20, 0],
  ]);
  const ids = nodes.slice(0, 2).map((m) => m.id);
  const first = duplicateNodes(nodes, [], ids);
  expect(first.metrics.map((m) => m.canvasPosition)).toEqual([
    { x: 0, y: 460 },
    { x: 298, y: 460 },
  ]);
  const repeated = duplicateNodes([...nodes, ...first.metrics], [], ids);
  expect(repeated.metrics.map((m) => m.canvasPosition!.y)).toEqual([690, 690]);
});

it("keeps an equally wide and tall canvas group duplicating to the right", () => {
  const nodes = group([
    [0, 0],
    [0, 1],
  ]);
  nodes[0].canvasPosition = { x: 0, y: 0 };
  nodes[1].canvasPosition = { x: 0, y: 68 };
  const copies = duplicateNodes(
    nodes,
    [],
    nodes.map((m) => m.id)
  );
  expect(copies.metrics.map((m) => m.canvasPosition)).toEqual([
    { x: 298, y: 0 },
    { x: 298, y: 68 },
  ]);
});

it.each([
  {
    cells: [
      [2, 3],
      [2, 4],
      [2, 5],
    ],
    delta: [1, 0],
  },
  {
    cells: [
      [2, 3],
      [3, 3],
      [4, 3],
    ],
    delta: [0, 1],
  },
  {
    cells: [
      [2, 3],
      [2, 4],
      [3, 3],
      [3, 4],
    ],
    delta: [0, 2],
  },
  { cells: [[2, 3]], delta: [0, 1] },
])("places sheet copies by group shape: $cells", ({ cells, delta }) => {
  const nodes = group(cells as [number, number][]);
  const copies = duplicateNodes(
    nodes,
    [],
    nodes.map((m) => m.id)
  );
  expect(copies.metrics.map((m) => m.location)).toEqual(
    nodes.map(({ location }) => ({
      row: location.row + delta[0],
      column: location.column + delta[1],
    }))
  );
});

it("skips occupied blocks below a wide group, including gaps within sparse selections", () => {
  const nodes = group([
    [0, 0],
    [0, 2],
    [1, 1],
  ]);
  const ids = nodes.slice(0, 2).map((m) => m.id);
  const first = duplicateNodes(nodes, [], ids);
  expect(first.metrics.map((m) => m.location)).toEqual([
    { row: 2, column: 0 },
    { row: 2, column: 2 },
  ]);
  const second = duplicateNodes([...nodes, ...first.metrics], [], ids);
  expect(second.metrics.map((m) => m.location.row)).toEqual([3, 3]);
});

it("calculates both layouts for a wide group", () => {
  const nodes = group([
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
  const copies = duplicateNodes(
    nodes,
    [],
    nodes.map((m) => m.id)
  );
  expect(copies.metrics.map((m) => m.location)).toEqual([
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
  ]);
});

it("duplicates imported data nodes that have no expression", () => {
  const metrics = [
    {
      id: "data",
      space: 12,
      readableId: "A",
      name: "Imported data",
      location: { row: 0, column: 0 },
    },
  ];
  const result = duplicateNodes(
    metrics,
    [
      {
        metric: "data",
        guesstimateType: "DATA",
        data: [1, 2, 3],
        description: "Source",
      } as any,
    ],
    ["data"]
  );
  expect(result.guesstimates[0].data).toEqual([1, 2, 3]);
  expect(result.guesstimates[0].expression).toBe("");
  expect(result.metrics[0].space).toBe(12);
});
