import { extractMetricIds, expressionToInputFn } from "../guesstimate";

describe("extractMetricIds", () => {
  it("extracts metric ids from an expression", () => {
    expect(
      extractMetricIds({ expression: "${metric:abc} + ${metric:def} * 2" })
    ).toEqual(["abc", "def"]);
  });

  it("dedupes repeated ids and ignores fact references", () => {
    expect(
      extractMetricIds({
        expression: "${metric:abc} + ${metric:abc} - ${fact:xyz}",
      })
    ).toEqual(["abc"]);
  });

  it("returns an empty array when there are no metric references", () => {
    expect(extractMetricIds({ expression: "1 + 2" })).toEqual([]);
  });
});

describe("expressionToInputFn", () => {
  it("reuses the identifier mapping across expressions without leaking replacements", () => {
    const translate = expressionToInputFn(
      [
        { id: "a", readableId: "AA" },
        { id: "ab", readableId: "BB" },
      ] as any,
      [{ id: 12, variable_name: "cost" }]
    );
    for (let i = 0; i < 3; i++) {
      expect(
        translate({
          expression: "${metric:a} + ${metric:ab} + ${metric:a}",
        } as any).input
      ).toBe("AA + BB + AA");
      expect(
        translate({ expression: "${fact:12} * ${metric:a}" } as any).input
      ).toBe("#cost * AA");
    }
    expect(translate({ expression: "${metric:missing}" } as any).input).toBe(
      "??"
    );
    expect(
      translate({ expression: "", input: "legacy input" } as any).input
    ).toBe("legacy input");
    expect(expressionToInputFn()({ expression: "1 + 2" } as any).input).toBe(
      "1 + 2"
    );
  });
});
