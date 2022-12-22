import { newFlowState, actions, states, subStage } from "./state_machine";

const defaultStage = {
  flowStage: "START",
  iframe: {
    href: null,
    website_name: null,
    request: {
      waiting: false,
      error: null,
      status: "NOT_SENT",
    },
  },
  synchronization: {
    request: {
      waiting: false,
      error: null,
      status: "NOT_SENT",
    },
  },
};

describe("FirstSubscriptionStateMachine", () => {
  describe("#subStage", () => {
    it(`in initial state`, () => {
      expect(subStage(defaultStage)).to.equal("START");
    });

    it(`in cancelled state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.flowStage = states.cancelled;
      expect(subStage(newStage)).to.equal("CANCELLED");
    });

    it(`in form fetching state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.flowStage = "FORM";
      newStage.iframe.request = { waiting: true, error: null, status: "START" };
      expect(subStage(newStage)).to.equal("FORM_START");
    });

    it(`in form success state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.flowStage = "FORM";
      newStage.iframe.request = {
        waiting: false,
        error: null,
        status: "SUCCESS",
      };
      expect(subStage(newStage)).to.equal("FORM_SUCCESS");
    });

    it(`in synchronization start state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.flowStage = "SYNCHRONIZATION";
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "START",
      };
      expect(subStage(newStage)).to.equal("SYNCHRONIZATION_START");
    });

    it(`in synchronization success state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.flowStage = "SYNCHRONIZATION";
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "SUCCESS",
      };
      expect(subStage(newStage)).to.equal("SYNCHRONIZATION_SUCCESS");
    });

    it(`in unnecessary state`, () => {
      let newStage = _.clone(defaultStage);
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "SUCCESS",
      };
      newStage.flowStage = states.unnecessary;
      expect(subStage(newStage)).to.equal("UNNECESSARY");
    });
  });
});
