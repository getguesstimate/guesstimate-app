import { CanvasLocation } from "~/lib/locationUtils";
import { TitleAlignment } from "~/modules/metrics/reducer";

export function automaticTitleAlignment(
  location: CanvasLocation,
  occupied: (location: CanvasLocation) => boolean
): TitleAlignment {
  const { row, column } = location;
  const left = occupied({ row, column: column - 1 });
  const right = occupied({ row, column: column + 1 });
  const top = occupied({ row: row - 1, column });
  const bottom = occupied({ row: row + 1, column });
  const count = Number(left) + Number(right) + Number(top) + Number(bottom);
  if (count === 0 || count >= 3 || (left && right) || (top && bottom))
    return "center-center";
  return `${top ? "top" : bottom ? "bottom" : "center"}-${
    left ? "left" : right ? "right" : "center"
  }` as TitleAlignment;
}
