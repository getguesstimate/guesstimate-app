import * as engine from "~/lib/engine/engine";
import { AppThunk } from "~/modules/store";
import { fetchById, generalUpdate } from "~/modules/spaces/actions";
import { runSimulations } from "~/modules/simulations/actions";
import { undo, redo } from "~/modules/checkpoints/actions";
import { changeActionState } from "~/modules/canvas_state/actions";

export const loadWorkspaceModel =
  (spaceId: number, token: string | null): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    if (!getState().spaces.find((s) => s.id === spaceId)?.graph) {
      await dispatch(fetchById(spaceId, token));
    }
    dispatch(runSimulations({ spaceId }));
  };

// Save a history change without adding a checkpoint and discarding the redo stack.
export const changeWorkspaceHistory =
  (spaceId: number, forward: boolean): AppThunk =>
  (dispatch, getState) => {
    dispatch(forward ? redo(spaceId) : undo(spaceId));
    if (spaceId < 0) return;
    const state = getState();
    const space = state.spaces.find((s) => s.id === spaceId);
    if (!space) return;
    if (
      engine.space.canEdit(
        space,
        state.me,
        state.userOrganizationMemberships,
        state.canvasState
      )
    ) {
      const graph = engine.space.withGraph(space, state).graph;
      delete graph.simulations;
      dispatch(generalUpdate(spaceId, { graph }));
    } else dispatch(changeActionState("UNALLOWED_ATTEMPT"));
  };
