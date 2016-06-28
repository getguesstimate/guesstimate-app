import async from 'async'
import {call} from 'redux-saga/effects'

import e from 'gEngine/engine'

import {GraphPropagation} from '../../lib/propagation/graph-propagation'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function* runFormSimulation({getState, metricId, dispatch}) {
  const propagation = new GraphPropagation(dispatch, getState, {metricId, onlyHead: true})
  yield propagation.run()
  yield* runDescendantSimulation({getState, metricId, dispatch})
}

export function* runUndoSimulations({getState, spaceId, dispatch}) {
  yield call(delay, 350)
  const propagation = new GraphPropagation(dispatch, getState, {spaceId, onlyUnsimulated: true})
  yield propagation.run()
}

export function* runDescendantSimulation({getState, metricId, dispatch}) {
  yield call(delay, 200)
  const propagation = new GraphPropagation(dispatch, getState, {metricId, notHead: true})
  yield propagation.run()
}

export function deleteSimulations(metricIds) {
  return {type: 'DELETE_SIMULATIONS', metricIds}
}

export function runSimulations(params) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, params)).run()
  };
}

export function addSimulation(simulation) {
  return { type: 'UPDATE_SIMULATION', simulation};
}
