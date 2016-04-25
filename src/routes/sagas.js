import { takeLatest } from 'redux-saga'
import { runMetricSimluation, runFormSimulation } from 'gModules/simulations/actions.js'

export function* dispatchCatchSaga() {
  yield* takeLatest("RUN_FORM_SIMULATIONS", runMetricSimluation)
}
