import { item as formatter } from "../Function";

describe("Function", () => {
  describe("#matches", () => {
    const examples = [
      [{ text: "3" }, false],
      [{ text: "=3" }, true],
    ] as const;

    examples
      .map((e) => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(formatter.matches(e[0])).toEqual(e[1]);
        });
      })
      .map((e) => e());
  });

  describe("#format", () => {
    const examples = [
      [{ text: "=43+AB" }, { guesstimateType: "FUNCTION", text: "43+AB" }],
    ];

    examples
      .map((e) => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          const formatted = formatter.format(e[0]);
          expect(formatted.guesstimateType).toEqual(e[1].guesstimateType);
          expect(formatted.text).toEqual(e[1].text);
        });
      })
      .map((e) => e());
  });
});
