import _ from 'lodash';
import e from 'gEngine/engine';
import async from 'async'
import {FormPropogation} from './formPropogation'

function runSimulation(dispatch, getState, metricId, n) {
  const graph = e.graph.create(getState());
  const simulation = e.graph.runSimulation(graph, metricId, n);
  if (e.simulation.hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

export function runFormSimulations(metricId) {
  return (dispatch, getState) => {
    (new FormPropogation(dispatch, getState, metricId)).run()
  }
}

export function deleteSimulations(metricId) {
  return { type: 'DELETE_SIMULATION', metricId};
}

export function runSimulations(value, getState) {
  let nn = 500;
  return (dispatch, getState) => {
    let metricIds = getState().metrics.map(n => n.id);
    let metricId = e.array.cycle(metricIds);

    var count = 0;
    let max = 10;

    async.during(
        function (callback) {
          return callback(null, count < max);
        },
        function (callback) {
          count++;
          runSimulation(dispatch, getState, metricId.next().value, nn);
          _.delay(() => {callback(null)}, 1);
        },
        //function (err) {
        //}
    );
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
