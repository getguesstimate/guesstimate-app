import e from 'gEngine/engine';
import async from 'async'
import {GraphPropagation} from '../../lib/propagation/graph-propagation.js'

function runSimulation(dispatch, getState, metricId, n) {
  const graph = e.graph.create(getState());
  const simulation = e.graph.runSimulation(graph, metricId, n);
  if (e.simulation.hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

export function runFormSimulations(metricId) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, {metricId})).run()
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
