import { Evaluate } from "./evaluator";

describe("financial function security boundary", () => {
  test.each(["IRR(-100, 110)", "seekZero(1)"])(
    "does not expose the unpatched Finance.js function %s",
    (expression) => {
      const result = Evaluate(expression, 1, {});

      expect(result.errors).not.toHaveLength(0);
      expect(result.values ?? []).toHaveLength(0);
    }
  );

  test.each([
    ["PV(10, 100, 1)", 90.91],
    ["FV(10, 100, 2)", 121],
    ["NPV(10, -100, 110)", 0],
  ])("preserves the supported financial formula %s", (expression, expected) => {
    const result = Evaluate(expression as string, 1, {});

    expect(result.errors).toHaveLength(0);
    expect(result.values).toHaveLength(1);
    expect(result.values![0]).toBeCloseTo(expected as number);
  });
});
