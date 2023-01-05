import fetch, { enableFetchMocks } from "jest-fetch-mock";

import { generalUpdate } from "./actions";

import { expectToCallActions } from "~/modules/mockStore";

enableFetchMocks();

describe("async actions", () => {
  it("creates canvasState/changeActionState when saving fails", (done) => {
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
      { type: "canvasState/changeActionState", payload: "SAVING" },
      { type: "canvasState/changeActionState", payload: "ERROR" },
    ];

    expectToCallActions(generalUpdate(1, {}), expectedActions, done, {
      spaces: [{ id: 1 }],
    });
  });
});
