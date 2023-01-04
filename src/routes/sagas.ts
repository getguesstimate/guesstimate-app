import { takeLatest } from "redux-saga";
import { fork } from "redux-saga/effects";
import {
  runFormSimulation,
  runUndoSimulations,
} from "~/modules/simulations/actions";

export function* runSimulationsSaga() {
  yield takeLatest("RUN_FORM_SIMULATIONS", runFormSimulation as any);
}

export function* runUndoSimulationsSaga() {
  yield takeLatest("RUN_UNDO_SIMULATIONS", runUndoSimulations as any);
}

export function* dispatchCatchSaga() {
  yield [fork(runUndoSimulationsSaga), fork(runSimulationsSaga)];
}
