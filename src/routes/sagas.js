import { takeLatest } from 'redux-saga'
import { runFormSimulations } from 'gModules/simulations/actions.js'

export function* dispatchCatchSaga() {
  yield* takeLatest("RUN_FORM_SIMULATIONS", runFormSimulations)
}
