import { firstSubscriptionsR } from "./reducer";
import { subStage } from "./state_machine";

describe("FirstSubscriptionFlowStage", () => {
  describe("a successful flow", () => {
    it("starts in start state", () => {
      let state = firstSubscriptionsR(undefined, { type: "WHATEVER" });
      expect(state.flowStage).toEqual("START");
      expect(subStage(state)).toEqual("START");

      state = firstSubscriptionsR(state, {
        type: "FIRST_SUBSCRIPTION_IFRAME_FETCH_START",
      });
      expect(state.flowStage).toEqual("FORM");
      expect(subStage(state)).toEqual("FORM_START");

      state = firstSubscriptionsR(state, {
        type: "FIRST_SUBSCRIPTION_IFRAME_FETCH_SUCCESS",
      });
      expect(state.flowStage).toEqual("FORM");
      expect(subStage(state)).toEqual("FORM_SUCCESS");

      state = firstSubscriptionsR(state, {
        type: "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_START",
      });
      expect(state.flowStage).toEqual("SYNCHRONIZATION");
      expect(subStage(state)).toEqual("SYNCHRONIZATION_START");

      state = firstSubscriptionsR(state, {
        type: "FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_SUCCESS",
      });
      expect(state.flowStage).toEqual("SYNCHRONIZATION");
      expect(subStage(state)).toEqual("SYNCHRONIZATION_SUCCESS");

      state = firstSubscriptionsR(state, {
        type: "FIRST_SUBSCRIPTION_FLOW_RESET",
      });
      expect(state.flowStage).toEqual("UNNECESSARY");
      expect(subStage(state)).toEqual("UNNECESSARY");
    });
  });
});
