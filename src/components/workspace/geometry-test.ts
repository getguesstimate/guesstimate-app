import {
  fitNodes,
  toWorld,
  zoomAt,
  MIN_ZOOM,
  MAX_ZOOM,
  connectionPath,
  NODE_WIDTH,
  NODE_HEIGHT,
} from "./geometry";

describe("workspace navigation", () => {
  it("keeps the point under the cursor stationary when zooming", () => {
    const view = { x: -340, y: 87, zoom: 0.7 };
    const cursor = { x: 230, y: 415 };
    const before = toWorld(cursor, view);
    const after = toWorld(cursor, zoomAt(view, cursor, 1.4));
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });
  it("clamps extreme zoom without shifting the anchor", () => {
    const view = { x: 0, y: 0, zoom: 1 };
    const cursor = { x: 20, y: 30 };
    expect(zoomAt(view, cursor, 0).zoom).toBe(MIN_ZOOM);
    expect(zoomAt(view, cursor, 100).zoom).toBe(MAX_ZOOM);
    expect(toWorld(cursor, zoomAt(view, cursor, 100))).toEqual(cursor);
  });
  it("fits nodes including negative world coordinates", () => {
    const nodes = [
      { x: -320, y: -180 },
      { x: 480, y: 250 },
    ];
    const view = fitNodes(nodes, 1200, 800);
    for (const point of nodes) {
      expect(point.x * view.zoom + view.x).toBeGreaterThanOrEqual(0);
      expect(point.y * view.zoom + view.y).toBeGreaterThanOrEqual(0);
      expect((point.x + NODE_WIDTH) * view.zoom + view.x).toBeLessThanOrEqual(
        1200
      );
      expect((point.y + NODE_HEIGHT) * view.zoom + view.y).toBeLessThanOrEqual(
        800
      );
    }
  });
  it("connects the appropriate node edges after freeform movement", () => {
    expect(connectionPath({ x: 0, y: 0 }, { x: 400, y: 0 })).toMatch(
      /^M 252 92 C/
    );
    expect(connectionPath({ x: 0, y: 0 }, { x: 0, y: 300 })).toMatch(
      /^M 126 184 C/
    );
  });
});
