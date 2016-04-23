import async from 'async'
import {GraphPropagation} from '../../lib/propagation/graph-propagation.js'
import { call, put } from 'redux-saga/effects'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export function* runFormSimulations({getState, metric, dispatch}) {
  yield call(delay, 50)
  const propagation = new GraphPropagation(dispatch, getState, {metricId: metric.id, useGuesstimateForm: true})
  propagation.run()
}

export function runMetricSimulations(metricId, useGuesstimateForm = false) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, {metricId, useGuesstimateForm})).run()
  }
}

export function deleteSimulations(metricIds) {
  return {type: 'DELETE_SIMULATIONS', metricIds}
}

export function runSimulations({spaceId}) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, {spaceId})).run()
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
