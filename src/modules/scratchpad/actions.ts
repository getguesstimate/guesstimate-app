import { Metric } from "~/modules/metrics/reducer";
import { duplicateNodes } from "./duplicate";
import { api } from "~/lib/guesstimate_api";
import { create as createMetric } from "~/lib/engine/metric";
import { AppThunk } from "~/modules/store";
import { CanvasLocation } from "~/lib/locationUtils";
import { fetchSuccess, registerGraphChange } from "~/modules/spaces/actions";
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
  (
    position: { x: number; y: number },
    location?: CanvasLocation,
    spaceId = SCRATCHPAD_ID
  ): AppThunk<string> =>
  (dispatch, getState) => {
    const metrics = getState().metrics.filter((m) => m.space === spaceId);
    const metric = {
      ...createMetric(metrics.map((m) => m.readableId)),
      space: spaceId,
      location: location || {
        column: 0,
        row: Math.max(-1, ...metrics.map((m) => m.location.row)) + 1,
      },
      canvasPosition: position,
      name: "",
    };
    dispatch({ type: "ADD_METRIC", item: metric });
    dispatch(registerGraphChange(spaceId));
    return metric.id;
  };

export const duplicateScratchpadCanvasNodes =
  (ids: string[], spaceId = SCRATCHPAD_ID): AppThunk<Metric[]> =>
  (dispatch, getState) => {
    const state = getState();
    const copied = duplicateNodes(
      state.metrics.filter((m) => m.space === spaceId),
      state.guesstimates,
      ids
    );
    if (!copied.metrics.length) return [];
    dispatch({
      type: "ADD_METRICS",
      items: copied.metrics,
      newGuesstimates: copied.guesstimates,
    });
    dispatch(registerGraphChange(spaceId));
    dispatch(
      runSimulations({
        spaceId,
        simulateSubset: copied.metrics.map((m) => m.id),
      })
    );
    return copied.metrics;
  };

export const moveScratchpadNodes =
  (
    ids: string[],
    delta: CanvasLocation,
    spaceId = SCRATCHPAD_ID
  ): AppThunk<boolean> =>
  (dispatch, getState) => {
    const metrics = getState().metrics.filter((m) => m.space === spaceId);
    const selected = metrics.filter((m) => ids.includes(m.id));
    if (!selected.length) return false;
    const updates = selected.map((m) => ({
      id: m.id,
      location: {
        row: m.location.row + delta.row,
        column: m.location.column + delta.column,
      },
    }));
    if (
      updates.some(
        ({ location }) =>
          location.row < 0 ||
          location.column < 0 ||
          metrics.some(
            (m) =>
              !ids.includes(m.id) &&
              m.location.row === location.row &&
              m.location.column === location.column
          )
      )
    )
      return false;
    for (const item of updates) dispatch({ type: "CHANGE_METRIC", item });
    dispatch(registerGraphChange(spaceId));
    return true;
  };

export const duplicateScratchpadNodes =
  (ids: string[], spaceId = SCRATCHPAD_ID): AppThunk<CanvasLocation[]> =>
  (dispatch) =>
    dispatch(duplicateScratchpadCanvasNodes(ids, spaceId)).map(
      (m) => m.location
    );

export const moveScratchpadCanvasNodes =
  (
    ids: string[],
    delta: { x: number; y: number },
    spaceId = SCRATCHPAD_ID
  ): AppThunk =>
  (dispatch, getState) => {
    const selected = getState().metrics.filter(
      (m) => m.space === spaceId && ids.includes(m.id)
    );
    if (!selected.length || (!delta.x && !delta.y)) return;
    for (const m of selected) {
      const point = m.canvasPosition || {
        x: m.location.column * 350,
        y: m.location.row * 230,
      };
      dispatch({
        type: "CHANGE_METRIC",
        item: {
          id: m.id,
          canvasPosition: { x: point.x + delta.x, y: point.y + delta.y },
        },
      });
    }
    dispatch(registerGraphChange(spaceId));
  };
