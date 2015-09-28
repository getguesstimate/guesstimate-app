import _ from 'lodash';
import e from '../lib/engine/engine';
import async from 'async'

function runSimulation(dispatch, getState, metricId, n) {
  const graph = e.graph.create(getState());
  const simulation = e.graph.runSimulation(graph, metricId, n);
  if (e.simulation.hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

function deleteSimulation(dispatch, getState, metricId, n) {
}

function runFormSimulation(dispatch, getState, metricId, n) {
  let {guesstimateForm} = getState()
  const bGraph = e.graph.toBizarroGraph(e.graph.create(getState()), guesstimateForm);
  const simulation = e.graph.runSimulation(bGraph, metricId, n);
  if (e.simulation.hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

export function runFormSimulations(metricId) {
  let n = 500;
  return (dispatch, getState) => {
    var count = 0;
    let max = 4;
    dispatch(deleteSimulations(metricId))
    async.during(
        function (callback) {
          return callback(null, count < max);
        },
        function (callback) {
          count++;
          runFormSimulation(dispatch, getState, metricId, n);
          _.delay(() => {callback(null)}, 1);
        },
        function (err) {
        }
    );
  };
}

export function deleteSimulations(metricId) {
  return { type: 'DELETE_SIMULATION', metricId};
}

export function runSimulations(value, getState) {
  let n = 500;
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
          runSimulation(dispatch, getState, metricId.next().value, n);
          _.delay(() => {callback(null)}, 1);
        },
        function (err) {
        }
    );
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
