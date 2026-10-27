import { undo, redo } from "./actions";
import { checkpointsR } from "./reducer";
import { metricsR, type Metric } from "~/modules/metrics/reducer";
import type { RootState } from "~/modules/store";
import type { AnyAction } from "redux";

it("undo restores inherited sheet positions and redo restores explicit canvas positions", () => {
  const original: Metric = {
    id: "node",
    readableId: "AA",
    space: 999,
    location: { row: 2, column: 3 },
  };
  const moved = { ...original, canvasPosition: { x: 125, y: 250 } };
  let state = {
    metrics: [moved],
    guesstimates: [],
    simulations: [],
    checkpoints: [
      {
        spaceId: 999,
        head: 0,
        checkpoints: [
          { metrics: [moved], guesstimates: [] },
          { metrics: [original], guesstimates: [] },
        ],
      },
    ],
  } as unknown as RootState;
  const dispatch = jest.fn();
  dispatch.mockImplementation((action: AnyAction) => {
    state = {
      ...state,
      metrics: metricsR(state.metrics, action),
      checkpoints: checkpointsR(state.checkpoints, action),
    };
    return action;
  });
  undo(999)(dispatch, () => state, undefined);
  expect(state.metrics[0].canvasPosition).toBeUndefined();
  expect(state.metrics[0].location).toEqual(original.location);
  redo(999)(dispatch, () => state, undefined);
  expect(state.metrics[0].canvasPosition).toEqual(moved.canvasPosition);
});
