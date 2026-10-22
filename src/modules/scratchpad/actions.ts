import { api } from "~/lib/guesstimate_api";
import { create as createMetric } from "~/lib/engine/metric";
import { AppThunk } from "~/modules/store";
import { fetchSuccess, updateGraph } from "~/modules/spaces/actions";
import { runSimulations } from "~/modules/simulations/actions";
import {
  createScratchpad,
  SCRATCHPAD_ID,
  SCRATCHPAD_TEMPLATE_ID,
} from "./model";

export const loadScratchpad =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    if (getState().spaces.some((s) => s.id === SCRATCHPAD_ID)) return;
    const template = await api(getState()).models.get(
      SCRATCHPAD_TEMPLATE_ID,
      null
    );
    dispatch(fetchSuccess([createScratchpad(template)]));
    dispatch(runSimulations({ spaceId: SCRATCHPAD_ID }));
  };

export const addScratchpadNode =
  (position: { x: number; y: number }): AppThunk<string> =>
  (dispatch, getState) => {
    const metrics = getState().metrics.filter((m) => m.space === SCRATCHPAD_ID);
    const metric = {
      ...createMetric(metrics.map((m) => m.readableId)),
      space: SCRATCHPAD_ID,
      location: {
        column: 0,
        row: Math.max(-1, ...metrics.map((m) => m.location.row)) + 1,
      },
      canvasPosition: position,
      name: "",
    };
    dispatch({ type: "ADD_METRIC", item: metric });
    dispatch(updateGraph(SCRATCHPAD_ID, false));
    return metric.id;
  };
