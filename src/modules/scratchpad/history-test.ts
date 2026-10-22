import { updateGraph } from "~/modules/spaces/actions";
import { undo } from "~/modules/checkpoints/actions";
import { RootState } from "~/modules/store";

it("never saves a temporary model to the server, even when saving is requested", () => {
  const state = {
    spaces: [{ id: -1 }],
    metrics: [],
    guesstimates: [],
    simulations: [],
    canvasState: { actionState: "" },
  } as unknown as RootState;
  const dispatch = jest.fn();
  updateGraph(-1, true)(dispatch, () => state, undefined);
  expect(dispatch).toHaveBeenCalledTimes(1);
  // The only dispatched thunk is the local history checkpoint.
  const innerDispatch = jest.fn();
  dispatch.mock.calls[0][0](innerDispatch);
  expect(innerDispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: "SAVE_CHECKPOINT", spaceId: -1 })
  );
});

it("undo in the scratchpad leaves another loaded model untouched", () => {
  const local = {
    id: "local",
    space: -1,
    readableId: "A",
    location: { row: 0, column: 0 },
    name: "after",
  };
  const other = {
    id: "other",
    space: 99,
    readableId: "B",
    location: { row: 0, column: 0 },
  };
  const before = { ...local, name: "before" };
  const state = {
    metrics: [local, other],
    guesstimates: [],
    simulations: [],
    checkpoints: [
      {
        spaceId: -1,
        head: 0,
        checkpoints: [
          { metrics: [local], guesstimates: [] },
          { metrics: [before], guesstimates: [] },
        ],
      },
    ],
  } as unknown as RootState;
  const dispatch = jest.fn();
  undo(-1)(dispatch, () => state, undefined);
  expect(dispatch).toHaveBeenCalledWith({
    type: "REMOVE_METRICS",
    item: { ids: [] },
  });
  expect(dispatch).toHaveBeenCalledWith({
    type: "CHANGE_METRIC",
    item: before,
  });
});

it.each([null, [10, 20]])(
  "undo restores custom data and recalculates it after %j",
  (data) => {
    const metric = {
      id: "data",
      space: -1,
      readableId: "A",
      location: { row: 0, column: 0 },
    };
    const before = {
      metric: "data",
      expression: "",
      guesstimateType: "DATA",
      data: [2, 4, 6],
    };
    const after = { ...before, data };
    const state = {
      metrics: [metric],
      guesstimates: [after],
      simulations: [],
      checkpoints: [
        {
          spaceId: -1,
          head: 0,
          checkpoints: [
            { metrics: [metric], guesstimates: [after] },
            { metrics: [metric], guesstimates: [before] },
          ],
        },
      ],
    } as unknown as RootState;
    const dispatch = jest.fn();
    undo(-1)(dispatch, () => state, undefined);
    expect(dispatch).toHaveBeenCalledWith({
      type: "CHANGE_GUESSTIMATE",
      metricId: "data",
      values: before,
    });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "RUN_UNDO_SIMULATIONS",
        metricIds: ["data"],
      })
    );
  }
);
