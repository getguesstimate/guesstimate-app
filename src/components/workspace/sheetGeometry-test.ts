import { cellAtPoint, cellName, columnName, sheetPoint } from "./sheetGeometry";

describe("sheet coordinates", () => {
  it("labels columns beyond Z without changing node reference IDs", () => {
    expect([0, 25, 26, 51, 52, 701].map(columnName)).toEqual([
      "A",
      "Z",
      "AA",
      "AZ",
      "BA",
      "ZZ",
    ]);
    expect(cellName({ row: 11, column: 26 })).toBe("AA12");
  });
  it("maps node positions back to their original sheet cells", () => {
    for (const location of [
      { row: 0, column: 0 },
      { row: 7, column: 3 },
      { row: 30, column: 26 },
    ]) {
      const point = sheetPoint(location);
      expect(cellAtPoint(point.x, point.y)).toEqual(location);
    }
  });
  it("keeps drops over row and column headings within the sheet", () => {
    expect(cellAtPoint(-100, -100)).toEqual({ row: 0, column: 0 });
  });
});
