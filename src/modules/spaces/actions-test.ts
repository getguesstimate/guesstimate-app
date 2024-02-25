import fetch, { enableFetchMocks } from "jest-fetch-mock";
import { expectToCallActions } from "~/modules/mockStore";

import { generalUpdate } from "./actions";

enableFetchMocks();

describe("async actions", () => {
  it("creates canvasState/changeActionState when saving fails", (done) => {
    fetch.mockResponseOnce(async () => {
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
