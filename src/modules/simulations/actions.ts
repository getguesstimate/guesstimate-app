import { call } from "redux-saga/effects";

import { GraphFilters, simulate } from "~/lib/propagation/wrapper";
import { AppDispatch, AppThunk, RootState } from "~/modules/store";
import { AnyAction } from "redux";
import { Simulation } from "./reducer";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function* runFormSimulation({
  getState,
  metricId,
  dispatch,
}: AnyAction) {
  yield simulate(dispatch, getState, { metricId, onlyHead: true });
  yield* runDescendantSimulation({ getState, metricId, dispatch });
}

export function* runUndoSimulations({
  getState,
  spaceId,
  dispatch,
  metricIds,
}: AnyAction) {
  yield call(delay, 350);
  yield simulate(dispatch, getState, {
    spaceId,
    simulateSubsetFrom: metricIds,
  });
}

export function* runDescendantSimulation({
  getState,
  metricId,
  dispatch,
}: {
  getState(): RootState;
  metricId: string;
  dispatch: AppDispatch;
}) {
  yield call(delay, 200);
  yield simulate(dispatch, getState, { metricId, notHead: true });
}

export function deleteSimulations(metricIds: string[]): AnyAction {
  return { type: "DELETE_SIMULATIONS", metricIds };
}

export const runSimulations =
  (params: GraphFilters): AppThunk =>
  (dispatch, getState) => {
    simulate(dispatch, getState, params);
  };

export function runFormSimulations(metricId: string): AppThunk {
  return (dispatch, getState) =>
    dispatch({ type: "RUN_FORM_SIMULATIONS", getState, dispatch, metricId });
}

export function addSimulation(simulation: Simulation): AnyAction {
  return { type: "UPDATE_SIMULATION", simulation };
}
