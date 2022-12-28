import { denormalizeFn, create } from "../metric";

describe("metric", () => {
  let metric: any = null;
  let graph: any = null;
  let result: any = null;

  const guesstimates = [
    { metric: "abc", name: "what" },
    { metric: "324", name: "silly" },
  ];

  const simulations = [
    { metric: "324", data: [2, 3, 54] },
    { metric: "abc", data: [2, 3, 4] },
  ];

  describe("denormalizeFn", () => {
    it("works with guesstimates and simulations", () => {
      metric = { id: "abc" };
      graph = { metrics: [metric], guesstimates, simulations };
      result = denormalizeFn(graph)(metric);
      expect(result.guesstimate).toEqual(guesstimates[0]);
      expect(result.simulation).toEqual(simulations[1]);
    });

    it("works with only guesstimates", () => {
      metric = { id: "abc" };
      graph = { metrics: [metric], guesstimates };
      result = denormalizeFn(graph)(metric);
      expect(result.guesstimate).toEqual(guesstimates[0]);
    });
  });

  describe("create", () => {
    it("generates uuid and readableId", () => {
      metric = create([]);
      expect(metric.id.length).toEqual(36);
      expect(metric.readableId.length).toEqual(2);
    });
  });
});
