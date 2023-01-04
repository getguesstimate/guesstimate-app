import { call } from "redux-saga/effects";

import { simulate } from "lib/propagation/wrapper";
import { AppThunk } from "gModules/store";
import { AnyAction } from "redux";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function* runFormSimulation({ getState, metricId, dispatch }) {
  yield simulate(dispatch, getState, { metricId, onlyHead: true });
  yield* runDescendantSimulation({ getState, metricId, dispatch });
}

export function* runUndoSimulations({
  getState,
  spaceId,
  dispatch,
  metricIds,
}) {
  yield call(delay, 350);
  yield simulate(dispatch, getState, {
    spaceId,
    simulateSubsetFrom: metricIds,
  });
}

export function* runDescendantSimulation({ getState, metricId, dispatch }) {
  yield call(delay, 200);
  yield simulate(dispatch, getState, { metricId, notHead: true });
}

export function deleteSimulations(metricIds): AnyAction {
  return { type: "DELETE_SIMULATIONS", metricIds };
}

export const runSimulations =
  (params): AppThunk =>
  (dispatch, getState) => {
    simulate(dispatch, getState, params);
  };

export function runFormSimulations(metricId): AppThunk {
  return (dispatch, getState) =>
    dispatch({ type: "RUN_FORM_SIMULATIONS", getState, dispatch, metricId });
}

export function addSimulation(simulation): AnyAction {
  return { type: "UPDATE_SIMULATION", simulation };
}
