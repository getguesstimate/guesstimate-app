import { parseSlurp } from "./slurpParser.js";

function matchPresent(pattern, sample) {
  if (!_.isObject(pattern)) {
    return _.isEqual(pattern, sample);
  }
  const matches = true;
  for (let key of Object.keys(pattern)) {
    if (!matchPresent(pattern[key], sample[key])) {
      console.warn("Objects differ at key ", key);
    }
  }
  return matches;
}

describe("parseSlurp", () => {
  describe("Valid Slurp", () => {
    const spaceName = "Space";
    const spaceDesc = "Space Description";
    const metricOneName = "Metric One";
    const guesstimateOneDesc = "Guesstimate One Description";
    const guesstimateOneData = [1, 2, 3];
    const metricTwoName = "Metric Two";
    const guesstimateTwoDesc = "Guesstimate Two Description";
    const guesstimateTwoData = [4, 5, 7];

    const slurp = {
      name: spaceName,
      provenance: spaceDesc,
      sips: [
        {
          name: metricOneName,
          provenance: guesstimateOneDesc,
          value: guesstimateOneData,
        },
        {
          name: metricTwoName,
          provenance: guesstimateTwoDesc,
          value: guesstimateTwoData,
        },
      ],
    };
    const parsedUpdatePattern = {
      name: spaceName,
      description: spaceDesc,
      newMetrics: [{ name: metricOneName }, { name: metricTwoName }],
      newGuesstimates: [
        {
          description: guesstimateOneDesc,
          data: guesstimateOneData,
        },
        {
          description: guesstimateTwoDesc,
          data: guesstimateTwoData,
        },
      ],
    };
    it("should parse a valid slurp", () => {
      const parsedSlurp = parseSlurp(slurp);
      expect(matchPresent(parsedUpdatePattern, parsedSlurp)).to.equal(true);
    });
  });
});
