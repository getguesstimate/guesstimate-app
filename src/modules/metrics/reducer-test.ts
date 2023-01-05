import { Metric, metricsR } from "./reducer";

function makeMetric(id: number, name: string): Metric {
  return {
    id: String(id),
    name,
    space: 1,
    location: { column: id, row: id },
    readableId: `M${id}`,
  };
}

describe("metrics", () => {
  describe("#SPACES_FETCH_SUCCESS", () => {
    const metrics: Metric[] = [
      makeMetric(1, "foo1"),
      makeMetric(2, "foo2"),
      makeMetric(2, "foo3"),
    ];

    it(`removes redundant metrics`, () => {
      const newMetrics = metricsR([], {
        type: "SPACES_FETCH_SUCCESS",
        records: [{ graph: { metrics } }],
      });
      expect(newMetrics.length).toEqual(2);
      expect(newMetrics[1].name).toEqual("foo3");
    });
  });

  describe("#ADD_METRIC", () => {
    const metrics = [makeMetric(1, "foo1"), makeMetric(2, "foo2")];

    it(`correctly adds new element`, () => {
      const newMetric = { id: "3", name: "foo3" };
      const newMetrics = metricsR(metrics, {
        type: "ADD_METRIC",
        item: newMetric,
      });
      expect(newMetrics.length).toEqual(3);
      expect(newMetrics[2].id).toEqual("3");
    });

    it(`correctly adds a redundant element`, () => {
      const newMetric = { id: "2", name: "foo3" };
      const newMetrics = metricsR(metrics, {
        type: "ADD_METRIC",
        item: newMetric,
      });
      expect(newMetrics.length).toEqual(2);
      expect(newMetrics[1].name).toEqual("foo3");
    });
  });

  describe("#CHANGE_METRIC", () => {
    const metrics = [
      makeMetric(1, "foo1"),
      makeMetric(2, "foo2"),
      makeMetric(3, "foo3"),
    ];

    it(`changes metric`, () => {
      const changedMetric = { id: "2", name: "bar2" };
      const newMetrics = metricsR(metrics, {
        type: "CHANGE_METRIC",
        item: changedMetric,
      });
      expect(newMetrics.length).toEqual(3);
      expect(newMetrics[1].name).toEqual("bar2");
    });
  });
});
