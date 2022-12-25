import { Location } from "lib/locationUtils";

export function selectRegion(corner1: Location, corner2: Location) {
  const leftX = Math.min(corner1.row, corner2.row);
  const topY = Math.max(corner1.column, corner2.column);
  const rightX = Math.max(corner1.row, corner2.row);
  const bottomY = Math.min(corner1.column, corner2.column);
  return {
    type: "MULTIPLE_SELECT",
    corner1: { row: leftX, column: bottomY },
    corner2: { row: rightX, column: topY },
  };
}

export function deSelectRegion() {
  return { type: "MULTIPLE_DE_SELECT" };
}
