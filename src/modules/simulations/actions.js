import async from 'async'
import {GraphPropagation} from '../../lib/propagation/graph-propagation.js'
import { call, put } from 'redux-saga/effects'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function* runMetricSimulation({getState, metricId, dispatch}) {
  const propagation = new GraphPropagation(dispatch, getState, {metricId, useGuesstimateForm: true, onlyHead: true})
  yield propagation.run()
  yield* runFormSimulation({getState, metricId, dispatch})
}

export function* runFormSimulation({getState, metricId, dispatch}) {
  yield call(delay, 200)
  const propagation = new GraphPropagation(dispatch, getState, {metricId, useGuesstimateForm: true, notHead: true})
  yield propagation.run()
}

export function deleteSimulations(metricIds) {
  return {type: 'DELETE_SIMULATIONS', metricIds}
}

export function runSimulations({spaceId, metricSubset}) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, {spaceId, metricSubset})).run()
  };
}

export function addSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
