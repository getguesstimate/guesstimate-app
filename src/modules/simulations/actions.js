import _ from 'lodash';
import e from 'gEngine/engine';
import async from 'async'
import {GraphPropagation} from '../../lib/propogation/graph-propogation.js'

function runSimulation(dispatch, getState, metricId, n) {
  const graph = e.graph.create(getState());
  const simulation = e.graph.runSimulation(graph, metricId, n);
  if (e.simulation.hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

export function runFormSimulations(metricId) {
  return (dispatch, getState) => {
    (new GraphPropagation(dispatch, getState, metricId)).run()
  }
}

export function deleteSimulations(metricIds) {
  return {type: 'DELETE_SIMULATIONS', metricIds}
}

export function runSimulations(metrics) {
  let nn = 3000;
  return (dispatch, getState) => {
    let metricIds = metrics.map(n => n.id);
    let metricId = e.array.cycle(metricIds);

    var count = 0;
    let max = metricIds.length * 2;

    async.during(
        function (callback) {
          return callback(null, count < max);
        },
        function (callback) {
          count++;
          runSimulation(dispatch, getState, metricId.next().value, nn);
          _.delay(() => {callback(null)}, 1);
        },
    );
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
