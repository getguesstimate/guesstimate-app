import { CanvasLocation, Region } from "~/lib/locationUtils";

const upto = (n: number): number[] => new Array(n).fill(0).map((_, i) => i);

export type RectangleShape = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export class GridPoint {
  rowHeights: number[];
  columnWidth: number;
  padding: number;

  constructor({
    rowHeights,
    columnWidth,
    padding,
  }: {
    rowHeights: number[];
    columnWidth: number;
    padding: number;
  }) {
    this.rowHeights = rowHeights;
    this.columnWidth = columnWidth;
    this.padding = padding;
  }

  _rowY(row: number) {
    const rowHeights = [0, ...this.rowHeights];
    let top = upto(row + 1)
      .map((r) => rowHeights[r])
      .reduce((a, b) => a + b);
    let bottom = top + this.rowHeights[row];
    top += this.padding;
    bottom -= this.padding;
    return { top, bottom };
  }

  _columnX(column: number) {
    const { columnWidth } = this;
    let left = column * columnWidth;
    let right = left + columnWidth;
    left += this.padding;
    right -= this.padding;
    return { left, right };
  }

  rectangle({ row, column }: CanvasLocation): RectangleShape {
    return Object.assign(this._rowY(row), this._columnX(column));
  }

  region(region: Region) {
    const input = this.rectangle(region[0]);
    const output = this.rectangle(region[1]);
    return {
      left: input.left - 1,
      top: input.top - 1,
      width: output.right - input.left + 1,
      height: output.bottom - input.top + 1,
    };
  }
}
