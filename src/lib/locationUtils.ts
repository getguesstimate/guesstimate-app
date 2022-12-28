import _ from "lodash";
import PropTypes from "prop-types";

export type Location = {
  column: number;
  row: number;
};

export type Region = [Location, Location];
export type MaybeRegion = [Location, Location] | [];

export const PTLocation = PropTypes.shape({
  column: PropTypes.number,
  row: PropTypes.number,
});

// Regions are [top_left_location, bottom_right_location]
export const PTRegion = PropTypes.arrayOf(PTLocation);

export function isLocation(test): test is Location {
  return !!test && test.hasOwnProperty("row") && test.hasOwnProperty("column");
}

export function isRegion(test: MaybeRegion): test is Region {
  return test.length === 2;
}

export function isAtLocation(test, location) {
  return test.row === location.row && test.column === location.column;
}

export function isWithinRegion(test, region) {
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

export function getBounds({
  start,
  end,
}: {
  start?: Location;
  end?: Location;
}): MaybeRegion {
  if (!start || !end) {
    return [];
  }
  return boundingRegion([start, end]);
}

export const move = ({ row, column }, direction) => ({
  row: row + direction.row,
  column: column + direction.column,
});

// Returns a function that translates all points of the form {row: X, column: Y} according to the translation that moves
// start to end.
export function translate(start, end) {
  return (l) => ({
    row: l.row + (end.row - start.row),
    column: l.column + (end.column - start.column),
  });
}

// Returns a function that can be used to search a list of objects of the form {location: ..., ... } for a value at the
// passed location.
export function existsAtLoc(seekLoc) {
  return (e) => isAtLocation(e.location, seekLoc);
}

export function boundingRegion(locations): Region {
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
