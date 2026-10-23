import { configureStore } from "~/modules/store";
import { fetchSuccess } from "~/modules/spaces/actions";
import { allowEdits, forbidEdits } from "~/modules/canvas_state/actions";
import { meSlice } from "~/modules/me/slice";
import {
  addScratchpadNode,
  duplicateScratchpadCanvasNodes,
  moveScratchpadNodes,
} from "~/modules/scratchpad/actions";
import { changeWorkspaceHistory } from "./modelActions";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import { changeMetric } from "~/modules/metrics/actions";
import { api } from "~/lib/guesstimate_api";

jest.mock("~/lib/guesstimate_api", () => ({ api: jest.fn() }));
jest.mock("~/modules/simulations/actions", () => ({
  runSimulations: () => () => {},
  runUndoSimulations: function* () {},
  runFormSimulation: function* () {},
}));

const model = (id: number, user_id = 7) =>
  ({
    id,
    user_id,
    name: `Model ${id}`,
    exported_facts_count: 0,
    graph: { metrics: [], guesstimates: [] },
  } as unknown as ApiSpace);
function setup(owner = true) {
  const store = configureStore();
  store.dispatch(fetchSuccess([model(12), model(13), model(-1)]));
  if (owner) {
    store.dispatch(
      meSlice.actions.setSession({ auth0_id: "test-owner" } as any)
    );
    store.dispatch(meSlice.actions.setProfile({ profile: { id: 7 } as any }));
  }
  const update = jest.fn(async (id, params) => ({ ...model(id), ...params }));
  (api as jest.Mock).mockReturnValue({ models: { update } });
  return { store, update };
}

it("keeps Viewing changes local, including add, duplicate, move, undo and redo", () => {
  const { store, update } = setup();
  store.dispatch(forbidEdits());
  const id = store.dispatch(
    addScratchpadNode({ x: 1, y: 2 }, { row: 0, column: 0 }, 12)
  );
  store.dispatch(duplicateScratchpadCanvasNodes([id], 12));
  store.dispatch(moveScratchpadNodes([id], { row: 1, column: 0 }, 12));
  store.dispatch(changeWorkspaceHistory(12, false));
  store.dispatch(changeWorkspaceHistory(12, true));
  expect(store.getState().metrics.filter((m) => m.space === 12)).toHaveLength(
    2
  );
  expect(store.getState().metrics.filter((m) => m.space === 13)).toHaveLength(
    0
  );
  expect(store.getState().metrics.filter((m) => m.space === -1)).toHaveLength(
    0
  );
  expect(update).not.toHaveBeenCalled();
});

it("saves additions and undo/redo to the selected model without losing redo", async () => {
  const { store, update } = setup();
  store.dispatch(allowEdits());
  store.dispatch(addScratchpadNode({ x: 1, y: 2 }, undefined, 12));
  await Promise.resolve();
  expect(update).toHaveBeenLastCalledWith(
    12,
    expect.objectContaining({
      graph: expect.objectContaining({ metrics: expect.any(Array) }),
    })
  );
  store.dispatch(changeWorkspaceHistory(12, false));
  expect(update.mock.calls.at(-1)![1].graph.metrics).toHaveLength(0);
  expect(store.getState().checkpoints.find((c) => c.spaceId === 12)!.head).toBe(
    1
  );
  store.dispatch(changeWorkspaceHistory(12, true));
  expect(update.mock.calls.at(-1)![1].graph.metrics).toHaveLength(1);
  expect(update.mock.calls.every(([id]) => id === 12)).toBe(true);
});

it("does not save another person’s model or the scratchpad even if editing is requested", () => {
  const { store, update } = setup(false);
  store.dispatch(allowEdits());
  store.dispatch(addScratchpadNode({ x: 0, y: 0 }, undefined, 12));
  store.dispatch(addScratchpadNode({ x: 0, y: 0 }));
  store.dispatch(changeWorkspaceHistory(12, false));
  expect(update).not.toHaveBeenCalled();
});


it("saves note display preferences, preserves them when duplicated, and restores the legacy default on undo", async () => {
  const { store, update } = setup();
  store.dispatch(allowEdits());
  const id = store.dispatch(addScratchpadNode({ x: 0, y: 0 }, undefined, 12));
  await Promise.resolve();
  store.dispatch(changeMetric({ id, showNotesOnNode: false }));
  await Promise.resolve();
  expect(update.mock.calls.at(-1)![1].graph.metrics[0].showNotesOnNode).toBe(false);
  store.dispatch(changeWorkspaceHistory(12, false));
  expect(store.getState().metrics.find((m) => m.id === id)!.showNotesOnNode).toBeUndefined();
  store.dispatch(changeWorkspaceHistory(12, true));
  expect(store.getState().metrics.find((m) => m.id === id)!.showNotesOnNode).toBe(false);
  const copies = store.dispatch(duplicateScratchpadCanvasNodes([id], 12));
  expect(copies[0].showNotesOnNode).toBe(false);
});
