import { automaticTitleAlignment } from "./titleAlignment";

it("aligns toward adjacent cells, centering ambiguous neighborhoods", () => {
  const sides = [
    { row: 2, column: 1 },
    { row: 2, column: 3 },
    { row: 1, column: 2 },
    { row: 3, column: 2 },
  ];
  const expected = [
    "center-center",
    "center-left",
    "center-right",
    "center-center",
    "top-center",
    "top-left",
    "top-right",
    "center-center",
    "bottom-center",
    "bottom-left",
    "bottom-right",
    "center-center",
    "center-center",
    "center-center",
    "center-center",
    "center-center",
  ];
  for (let mask = 0; mask < 16; mask++) {
    const occupied = sides.filter((_, i) => mask & (1 << i));
    expect(
      automaticTitleAlignment({ row: 2, column: 2 }, (cell) =>
        occupied.some((p) => p.row === cell.row && p.column === cell.column)
      )
    ).toBe(expected[mask]);
  }
});
