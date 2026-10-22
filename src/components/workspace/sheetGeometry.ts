import { CanvasLocation } from "~/lib/locationUtils";

export const SHEET_COLUMN = 284;
export const SHEET_ROW = 208;
export const SHEET_GUTTER = 36;
export const SHEET_HEADING = 30;
export const SHEET_INSET = { x: 16, y: 12 };

export function columnName(column: number): string {
  let result = "";
  for (let n = column + 1; n > 0; n = Math.floor((n - 1) / 26))
    result = String.fromCharCode(65 + ((n - 1) % 26)) + result;
  return result;
}
export const cellName = ({ row, column }: CanvasLocation) =>
  `${columnName(column)}${row + 1}`;
export const sameCell = (a: CanvasLocation, b: CanvasLocation) =>
  a.row === b.row && a.column === b.column;
export const sheetPoint = ({ row, column }: CanvasLocation) => ({
  x: SHEET_GUTTER + column * SHEET_COLUMN + SHEET_INSET.x,
  y: SHEET_HEADING + row * SHEET_ROW + SHEET_INSET.y,
});
export const cellAtPoint = (x: number, y: number): CanvasLocation => ({
  column: Math.max(0, Math.floor((x - SHEET_GUTTER) / SHEET_COLUMN)),
  row: Math.max(0, Math.floor((y - SHEET_HEADING) / SHEET_ROW)),
});
