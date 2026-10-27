import { api } from "~/lib/guesstimate_api";
import { AppThunk } from "~/modules/store";
import { fetchSuccess } from "~/modules/spaces/actions";
import { runSimulations } from "~/modules/simulations/actions";
import { createScratchpad, SCRATCHPAD_ID, SCRATCHPAD_TEMPLATE_ID } from "./model";

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
