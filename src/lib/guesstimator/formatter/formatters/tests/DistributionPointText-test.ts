import { item as formatter } from "../DistributionPointText";

describe("DistributionPointText", () => {
  describe("#matches", () => {
    const examples = [
      [{ text: "3" }, true],
      [{ value: "3" }, false],
    ] as const;

    examples
      .map((e) => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(formatter.matches(e[0] as any)).toEqual(e[1]);
        });
      })
      .forEach((e) => e());
  });

  describe("#format", () => {
    const examples = [
      [{ text: "3" }, { guesstimateType: "POINT", params: [3] }],
      [{ text: "3K" }, { guesstimateType: "POINT", params: [3000] }],
    ];

    examples
      .map((e) => () => {
        it(`works for guesstimate ${JSON.stringify(e[0])}`, () => {
          expect(formatter.format(e[0])).toEqual(e[1]);
        });
      })
      .forEach((e) => e());
  });
});
