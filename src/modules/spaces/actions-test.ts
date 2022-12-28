import fetch, { enableFetchMocks } from "jest-fetch-mock";

import { generalUpdate } from "./actions";

import { expectToCallActions } from "gModules/mockStore";

enableFetchMocks();

describe("async actions", () => {
  it("creates CHANGE_CANVAS_STATE when saving fails", (done) => {
    fetch.mockResponseOnce(async (req) => {
      return {
        init: {
          status: 422,
        },
        body: "{}",
      };
    });

    const expectedActions = [
      { type: "SPACES_UPDATE_START", record: { id: 1 }, data: undefined },
      { type: "CHANGE_CANVAS_STATE", values: { actionState: "SAVING" } },
      { type: "CHANGE_CANVAS_STATE", values: { actionState: "ERROR" } },
    ];

    expectToCallActions(generalUpdate(1, {}), expectedActions, done, {
      spaces: [{ id: 1 }],
    });
  });
});
