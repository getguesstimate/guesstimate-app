import type { Point, Viewport } from "./geometry";

export type CanvasGesture =
  | { kind: "select"; start: Point }
  | {
      kind: "pan" | "node";
      start: Point;
      origin: Point;
      id?: string;
      deselectOnClick?: boolean;
      moved?: boolean;
    }
  | { kind: "pinch"; distance: number; midpoint: Point; view: Viewport };
