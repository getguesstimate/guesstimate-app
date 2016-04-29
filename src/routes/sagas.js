import { takeLatest } from 'redux-saga'
import { runMetricSimulation, runFormSimulation } from 'gModules/simulations/actions.js'

export function* dispatchCatchSaga() {
  yield* takeLatest("RUN_FORM_SIMULATIONS", runMetricSimulation)
}
