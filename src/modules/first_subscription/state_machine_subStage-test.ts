import _ from "lodash";

import { states, subStage } from "./state_machine";

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
      expect(subStage(defaultStage)).toEqual("START");
    });

    it(`in cancelled state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.flowStage = states.cancelled;
      expect(subStage(newStage)).toEqual("CANCELLED");
    });

    it(`in form fetching state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.flowStage = "FORM";
      newStage.iframe.request = { waiting: true, error: null, status: "START" };
      expect(subStage(newStage)).toEqual("FORM_START");
    });

    it(`in form success state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.flowStage = "FORM";
      newStage.iframe.request = {
        waiting: false,
        error: null,
        status: "SUCCESS",
      };
      expect(subStage(newStage)).toEqual("FORM_SUCCESS");
    });

    it(`in synchronization start state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.flowStage = "SYNCHRONIZATION";
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "START",
      };
      expect(subStage(newStage)).toEqual("SYNCHRONIZATION_START");
    });

    it(`in synchronization success state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.flowStage = "SYNCHRONIZATION";
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "SUCCESS",
      };
      expect(subStage(newStage)).toEqual("SYNCHRONIZATION_SUCCESS");
    });

    it(`in unnecessary state`, () => {
      const newStage = _.clone(defaultStage);
      newStage.synchronization.request = {
        waiting: true,
        error: null,
        status: "SUCCESS",
      };
      newStage.flowStage = states.unnecessary;
      expect(subStage(newStage)).toEqual("UNNECESSARY");
    });
  });
});
