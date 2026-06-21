import { extractMetricIds } from "../guesstimate";

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
