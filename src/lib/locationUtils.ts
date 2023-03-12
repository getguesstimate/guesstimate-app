import _ from "lodash";

// `Location` is a builtin type, so we use a longer name
export type CanvasLocation = {
  column: number;
  row: number;
};

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type DirectionVector = {
  column: number;
  row: number;
};

// Regions are [top_left_location, bottom_right_location]
export type Region = Readonly<[CanvasLocation, CanvasLocation]>;
export type MaybeRegion = Region | [];

export function isLocation(test): test is CanvasLocation {
  return !!test && test.hasOwnProperty("row") && test.hasOwnProperty("column");
}

export function isRegion(test: MaybeRegion): test is Region {
  return test.length === 2;
}

export function isAtLocation(
  test: CanvasLocation | {},
  location: CanvasLocation
) {
  if (!("row" in test)) {
    return false;
  }
  return test.row === location.row && test.column === location.column;
}

export function isWithinRegion(test: CanvasLocation, region?: MaybeRegion) {
  if (!test || !region || region.length !== 2) {
    return false;
  }
  return (
    test.row >= region[0].row &&
    test.row <= region[1].row &&
    test.column >= region[0].column &&
    test.column <= region[1].column
  );
}

export function getBounds(
  region:
    | {
        start: CanvasLocation;
        end?: CanvasLocation;
      }
    | undefined
): MaybeRegion {
  if (!region || !region.end) {
    return [];
  }
  return boundingRegion([region.start, region.end]);
}

export const move = (
  { row, column }: CanvasLocation,
  direction: DirectionVector
): CanvasLocation => ({
  row: row + direction.row,
  column: column + direction.column,
});

// Returns a function that translates all points of the form {row: X, column: Y} according to the translation that moves
// start to end.
export function translate(start: CanvasLocation, end: CanvasLocation) {
  return (l: CanvasLocation) => ({
    row: l.row + (end.row - start.row),
    column: l.column + (end.column - start.column),
  });
}

// Returns a function that can be used to search a list of objects of the form {location: ..., ... } for a value at the
// passed location.
export function existsAtLoc(seekLoc: CanvasLocation) {
  return (e) => isAtLocation(e.location, seekLoc);
}

export function boundingRegion(locations: CanvasLocation[]): Region {
  if (_.isEmpty(locations)) {
    return [
      { row: 0, column: 0 },
      { row: 0, column: 0 },
    ];
  }
  return [
    {
      row: Math.min(...locations.map((l) => l.row)),
      column: Math.min(...locations.map((l) => l.column)),
    },
    {
      row: Math.max(...locations.map((l) => l.row)),
      column: Math.max(...locations.map((l) => l.column)),
    },
  ];
}
