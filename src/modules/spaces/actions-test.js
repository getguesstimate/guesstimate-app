import nock from "nock";

import { generalUpdate } from "./actions";

import { expectToCallActions } from "gModules/mockStore";

describe("async actions", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("creates CHANGE_CANVAS_STATE when saving fails", (done) => {
    nock("http://localhost:3000/").patch("/spaces/1").reply(422, {});

    const expectedActions = [
      { type: "SPACES_UPDATE_START", record: { id: 1 }, data: undefined },
      { type: "CHANGE_CANVAS_STATE", values: { actionState: "SAVING" } },
      { type: "CHANGE_CANVAS_STATE", values: { actionState: "ERROR" } },
    ];

    expectToCallActions(generalUpdate(1), expectedActions, done, {
      spaces: [{ id: 1 }],
    });
  });
});
