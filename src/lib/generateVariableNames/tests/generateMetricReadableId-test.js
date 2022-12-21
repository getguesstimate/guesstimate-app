import { expect } from "chai";
import { withReadableId } from "../generateMetricReadableId";

describe("generateReadableId", () => {
  const existingReadableIds = ["AB", "PIN", "PIN1", "PIN2", "A"];

  const testCases = [
    {
      description: `
        A metric with a two word name should yield a readable ID given by a truncation of the metric's name.
      `,
      metric: { name: "Revenue" },
      shouldGenerateReadableId: true,
      expectedReadableId: "REV",
    },
    {
      description: `
        A metric whose acronym is not present in the list should yield a readable ID given by the acronym of the metric.
      `,
      metric: { name: "People in Boston" },
      shouldGenerateReadableId: true,
      expectedReadableId: "PIB",
    },
    {
      description: `
        A metric whose acronym is present in the list should yield a readable ID given by the acronym of the metric
        followed by the lowest number not present in the list of readable IDs.
      `,
      metric: { name: "People in New York" },
      shouldGenerateReadableId: true,
      expectedReadableId: "PIN3",
    },
    {
      description: `
        A metric with no name should not yield a new readable ID.
      `,
      metric: {},
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with an empty name should not yield a new readable ID.
      `,
      metric: { name: "" },
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with a name with only spaces should not yield a new readable ID.
      `,
      metric: { name: "     " },
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with a name with only spaces and digits should not yield a new readable ID.
      `,
      metric: { name: " 2016 " },
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with a name with only special characters should not yield a new readable ID.
      `,
      metric: { name: " =4*20 5%2 &91/\\94`'\"()-_+!@#$,.;:><{[}]?~ " },
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with a name with only foreign characters should not yield a new readable ID.
      `,
      metric: {
        name: "Люди в Бостоне, מענטשן אין באָסטאָן, बोस्टन में लोग, مردم در بوستو.",
      },
      shouldGenerateReadableId: false,
    },
    {
      description: `
        A metric with a name with a leading number should drop the number in the readable ID.
      `,
      metric: { name: "2016 Revenue" },
      shouldGenerateReadableId: true,
      expectedReadableId: "REV",
    },
    {
      description: `
        A metric with an acronym worthy name with a trailing number should include the full number in the readable ID.
      `,
      metric: { name: "Projected Revenue 2016" },
      shouldGenerateReadableId: true,
      expectedReadableId: "PR2016",
    },
    {
      description: `
        A metric that generates a readableID with underscores should check for existence of the underscore-stripped
        name rather than the name with underscores.
      `,
      metric: { name: "a - b" },
      shouldGenerateReadableId: true,
      expectedReadableId: "A1",
    },
  ];

  testCases.forEach(
    ({ metric, description, shouldGenerateReadableId, expectedReadableId }) => {
      it(description, () => {
        const { readableId } = withReadableId(metric, existingReadableIds);
        if (shouldGenerateReadableId) {
          expect(readableId).to.equal(expectedReadableId);
        } else {
          expect(readableId).to.not.be.ok;
        }
      });
    }
  );
});
