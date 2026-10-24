import {
  arrangeComposition,
  embedConnectionPath,
  frameComposition,
  EMBED_NODE_WIDTH,
} from "./layout";

describe("embedded model surface", () => {
  it.each([
    [320, 480],
    [1282, 769],
    [600, 220],
  ])(
    "keeps readable sizing and scrollable bounds at %i × %i",
    (width, height) => {
      const boxes = [
        { x: -500, y: -300, height: 50 },
        { x: 6500, y: 4200, height: 150 },
      ];
      const view = frameComposition(boxes, width, height);
      expect(view.zoom).toBe(0.93);
      expect(view.width).toBeGreaterThan(width);
      expect(view.height).toBeGreaterThan(height);
      for (const box of boxes) {
        expect(box.x * view.zoom + view.x).toBeGreaterThanOrEqual(0);
        expect(box.y * view.zoom + view.y).toBeGreaterThanOrEqual(0);
        expect(
          (box.x + EMBED_NODE_WIDTH) * view.zoom + view.x
        ).toBeLessThanOrEqual(view.width);
        expect((box.y + box.height) * view.zoom + view.y).toBeLessThanOrEqual(
          view.height
        );
      }
    }
  );
  it("sizes each row to its tallest content and preserves manual positions", () => {
    const positions = arrangeComposition(
      [
        { id: "title", location: { row: 0, column: 0 } },
        { id: "a", location: { row: 1, column: 0 } },
        { id: "b", location: { row: 1, column: 1 } },
        { id: "c", location: { row: 2, column: 0 } },
        {
          id: "manual",
          location: { row: 0, column: 0 },
          canvasPosition: { x: -50, y: 300 },
        },
      ],
      { title: 40, a: 90, b: 130, c: 80, manual: 100 }
    );
    expect(positions.get("a")!.y).toBe(60);
    expect(positions.get("b")!.y).toBe(60);
    expect(positions.get("c")!.y).toBe(210);
    expect(positions.get("a")!.height).toBe(130);
    expect(positions.get("b")!.height).toBe(130);
    expect(positions.get("c")!.height).toBe(80);
    expect(positions.get("manual")).toEqual({ x: -50, y: 300, height: 100 });
  });
  it("connects to actual card edges when their heights differ", () => {
    const from = { x: 0, y: 0, height: 60 },
      to = { x: 230, y: 0, height: 120 };
    expect(embedConnectionPath(from, to)).toBe(
      "M 200 30 C 220 30, 210 60, 230 60"
    );
  });
  it("handles an empty model", () => {
    expect(frameComposition([], 320, 480)).toEqual({
      x: 20,
      y: 20,
      zoom: 0.93,
      width: 320,
      height: 480,
    });
  });
});
