import _ from "lodash";
import { Guesstimator } from "./index";

describe("Guesstimator", () => {
  describe(".parse", () => {
    it("works with a simple function", () => {
      const input = { text: "=34" };
      const [error, item] = Guesstimator.parse(input);
      expect(_.isEmpty(error)).toBe(true);

      const parsedInput = item.parsedInput;
      expect(parsedInput.guesstimateType).toBe("FUNCTION");
      expect(parsedInput.text).toBe("34");
    });
  });

  describe(".samplerTypes", () => {
    it("has many samplerTypes", () => {
      expect(Guesstimator.samplerTypes.all.length).toBeGreaterThan(4);
    });
  });

  describe("#samplerType", () => {
    it("has many samplerTypes", () => {
      const input = { text: "=34" };
      const [error, item] = Guesstimator.parse(input);
      expect(item.samplerType().referenceName).toBe("FUNCTION");
    });
  });
});
