import {takeLatest} from 'redux-saga'
import {runMetricSimulation, runUndoSimulations, runFormSimulation} from 'gModules/simulations/actions'

export function* dispatchCatchSaga() {
  yield* takeLatest("RUN_FORM_SIMULATIONS", runMetricSimulation)
  yield* takeLatest("RUN_UNDO_SIMULATIONS", runUndoSimulations)
}
