import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import runMetricSimulations from 'gModules/simulations/actions.js'
import {GraphPropagation} from '../lib/propagation/graph-propagation.js'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function* runFormSimulations({getState, metric, dispatch}) {
  yield call(delay, 150)
  const aa = new GraphPropagation(dispatch, getState, {metricId: metric.id, useGuesstimateForm: true})
  aa.run()
}

//dispatch({type: "FOOBAR", state, metric, dispatch});

export function* mySaga() {
  yield* takeLatest("FOOBAR", runFormSimulations)
}

