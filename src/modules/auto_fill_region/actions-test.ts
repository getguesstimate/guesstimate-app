import * as actions from "./actions";

describe("Autofill Actions", () => {
  describe("dynamic fill", () => {
    // function fillDynamic(startMetric, startGuesstimate, direction)
    //   ...
    //   return (location, metrics) => {
    //     ...
    //     return { metric, guesstimate }
    const inputID = 2;
    const startExpression = `=1 + \$\{metric:${inputID}}`;
    const startMetric = {
      id: "1",
      readableId: "AA",
      location: { row: 1, column: 1 },
    };
    const startGuesstimate = {
      metric: "1",
      expression: startExpression,
      guesstimateType: "FUNCTION",
    };
    const direction = { row: 0, column: 1 };

    it("fills constants properly", () => {
      const location = { row: 1, column: 2 };
      const metrics = [
        {
          name: "Constant.",
          id: inputID,
          readableId: "VL",
          location: { row: 0, column: 0 },
        },
      ];
      const fillFn = actions.fillDynamic(
        startMetric,
        startGuesstimate,
        direction
      );
      const {
        guesstimate: { expression },
      } = fillFn(location, metrics);
      expect(expression).toEqual(startExpression);
    });

    it("fills properly with no translatable metrics, but some non-constant", () => {
      const location = { row: 1, column: 2 };
      const metrics = [
        {
          id: inputID,
          readableId: "VL",
          location: { row: 0, column: 0 },
        },
      ];
      const fillFn = actions.fillDynamic(
        startMetric,
        startGuesstimate,
        direction
      );
      const { metric, guesstimate } = fillFn(location, metrics);
      expect(!!metric).toEqual(false);
      expect(!!guesstimate).toEqual(false);
    });
  });
});
