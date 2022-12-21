import { takeLatest } from "redux-saga";
import { fork } from "redux-saga/effects";
import {
  runFormSimulation,
  runUndoSimulations,
} from "gModules/simulations/actions";

export function* runSimulationsSaga() {
  yield takeLatest("RUN_FORM_SIMULATIONS", runFormSimulation);
}

export function* runUndoSimulationsSaga() {
  yield takeLatest("RUN_UNDO_SIMULATIONS", runUndoSimulations);
}

export function* dispatchCatchSaga() {
  yield [fork(runUndoSimulationsSaga), fork(runSimulationsSaga)];
}
