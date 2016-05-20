import {takeLatest} from 'redux-saga'
import {fork} from 'redux-saga/effects'
import {runMetricSimulation, runUndoSimulations, runFormSimulation} from 'gModules/simulations/actions'

export function* runSimulationsSaga() {
  yield takeLatest("RUN_FORM_SIMULATIONS", runMetricSimulation)
}

export function* runUndoSimulationsSaga() {
  console.log("Running Undo Simulations")
  yield takeLatest("RUN_UNDO_SIMULATIONS", runUndoSimulations)
}

export function* dispatchCatchSaga() {
  yield [
    fork(runUndoSimulationsSaga),
    fork(runSimulationsSaga)
  ]
}
