import e from 'gEngine/engine';
import async from 'async'
import {GraphPropagation} from '../../lib/propagation/graph-propagation.js'

export function runMetricSimulations(metricId, useGuesstimateForm = false) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, {metricId, useGuesstimateForm})).run()
  }
}

export function runFormSimulations(metricId) {
  return (dispatch) => {
    dispatch(runMetricSimulations(metricId, true));
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
