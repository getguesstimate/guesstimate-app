import { metricsR } from "./reducer.js";

describe("metrics", () => {
  describe("#SPACES_FETCH_SUCCESS", () => {
    const metrics = [
      { id: "1", name: "foo1" },
      { id: "2", name: "foo2" },
      { id: "2", name: "foo3" },
    ];

    it(`removes redundant metrics`, () => {
      const newMetrics = metricsR([], {
        type: "SPACES_FETCH_SUCCESS",
        records: [{ graph: { metrics } }],
      });
      expect(newMetrics.length).to.equal(2);
      expect(newMetrics[1].name).to.equal("foo3");
    });
  });

  describe("#ADD_METRIC", () => {
    const metrics = [
      { id: "1", name: "foo1" },
      { id: "2", name: "foo2" },
    ];

    it(`correctly adds new element`, () => {
      const newMetric = { id: "3", name: "foo3" };
      const newMetrics = metricsR(metrics, {
        type: "ADD_METRIC",
        item: newMetric,
      });
      expect(newMetrics.length).to.equal(3);
      expect(newMetrics[2].id).to.equal("3");
    });

    it(`correctly adds a redundant element`, () => {
      const newMetric = { id: "2", name: "foo3" };
      const newMetrics = metricsR(metrics, {
        type: "ADD_METRIC",
        item: newMetric,
      });
      expect(newMetrics.length).to.equal(2);
      expect(newMetrics[1].name).to.equal("foo3");
    });
  });

  describe("#CHANGE_METRIC", () => {
    const metrics = [
      { id: "1", name: "foo1" },
      { id: "2", name: "foo2" },
      { id: "3", name: "foo3" },
    ];

    it(`changes metric`, () => {
      const changedMetric = { id: "2", name: "bar2" };
      const newMetrics = metricsR(metrics, {
        type: "CHANGE_METRIC",
        item: changedMetric,
      });
      expect(newMetrics.length).to.equal(3);
      expect(newMetrics[1].name).to.equal("bar2");
    });
  });
});
