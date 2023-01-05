import { Guesstimate } from "../guesstimates/reducer";
import { Metric } from "../metrics/reducer";
import * as actions from "./actions";

describe("Autofill Actions", () => {
  describe("dynamic fill", () => {
    // function fillDynamic(startMetric, startGuesstimate, direction)
    //   ...
    //   return (location, metrics) => {
    //     ...
    //     return { metric, guesstimate }
    const inputID = "2";
    const startExpression = `=1 + \$\{metric:${inputID}}`;
    const startMetric: Metric = {
      id: "1",
      readableId: "AA",
      location: { row: 1, column: 1 },
      space: 1,
    };
    const startGuesstimate: Guesstimate = {
      metric: "1",
      expression: startExpression,
      guesstimateType: "FUNCTION",
      input: null,
      description: "",
    };
    const direction = { row: 0, column: 1 };

    it("fills constants properly", () => {
      const location = { row: 1, column: 2 };
      const metrics: Metric[] = [
        {
          name: "Constant.",
          id: inputID,
          readableId: "VL",
          location: { row: 0, column: 0 },
          space: 1,
        },
      ];
      const fillFn = actions.fillDynamic(
        startMetric,
        startGuesstimate,
        direction
      );
      const { guesstimate } = fillFn(location, metrics);
      expect(guesstimate?.expression).toEqual(startExpression);
    });

    it("fills properly with no translatable metrics, but some non-constant", () => {
      const location = { row: 1, column: 2 };
      const metrics: Metric[] = [
        {
          id: inputID,
          readableId: "VL",
          location: { row: 0, column: 0 },
          space: 1,
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
