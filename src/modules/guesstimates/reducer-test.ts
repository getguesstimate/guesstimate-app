import { Guesstimate, guesstimatesR } from "./reducer";

describe("guesstimatesReducer", () => {
  describe("#SPACES_FETCH_SUCCESS", () => {
    const spaces = [
      {
        graph: {
          metrics: [],
          guesstimates: [
            { metric: "1", guesstimateType: "NONE", input: "" },
            { metric: "2", guesstimateType: "NONE", input: "" },
            { metric: "2", guesstimateType: "POINT", expression: "3" },
          ],
        },
      },
    ];

    it(`removes redundant metrics`, () => {
      const newGuesstimates = guesstimatesR([], {
        type: "SPACES_FETCH_SUCCESS",
        records: spaces,
      });
      expect(newGuesstimates.length).toEqual(2);
      expect(newGuesstimates[1].expression).toEqual("3");
    });
  });

  describe("#ADD_METRIC", () => {
    const guesstimates: Guesstimate[] = [
      {
        metric: "1",
        guesstimateType: "NONE",
        expression: "",
        description: "",
      },
      {
        metric: "2",
        guesstimateType: "POINT",
        expression: "3",
        description: "",
      },
    ];

    it(`correctly adds new element`, () => {
      const newGuesstimates = guesstimatesR(guesstimates, {
        type: "ADD_METRIC",
        item: { id: "3" },
      });
      expect(newGuesstimates.length).toEqual(3);
      expect(newGuesstimates[2].metric).toEqual("3");
    });

    it(`correctly adds a redundant element`, () => {
      const newGuesstimates = guesstimatesR(guesstimates, {
        type: "ADD_METRIC",
        item: { id: "2" },
      });
      expect(newGuesstimates.length).toEqual(2);
      expect(newGuesstimates[1].expression).toEqual("");
    });
  });
});
