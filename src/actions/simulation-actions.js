import _ from 'lodash';
import e from '../lib/engine/engine';

function runSimulation(guesstimate, dGraph, n ) {
  return e.guesstimate.sample(guesstimate, dGraph, n);
}

let foo = function(dispatch, getState, metricId, n) {
  return new Promise(function(resolve, reject) {
    setTimeout(function(){
      _runSimulation(dispatch, getState, metricId, n)
      resolve();
    }, 0.01)
  });
};

function gatherGuesstimates(dGraph){
  return dGraph.metrics.map(e => e.guesstimate);
}

function hasValues(simulation) {
  return (simulation.sample.values.length && simulation.sample.values.length > 0);
}

export function _runSimulation(dispatch, getState, metricId, n) {
  let graph = _.pick(getState(), ['metrics', 'guesstimates', 'simulations']);
  let dGraph = e.graph.denormalize(graph);
  let guesstimate = dGraph.metrics.find(m => (m.id === metricId)).guesstimate;
  let simulation = runSimulation(guesstimate, dGraph, n);
  if (hasValues(simulation)) {
    dispatch(addPartialSimulation(simulation));
  }
}

export function runSimulations(value, getState) {
  let n = 3000;
  return (dispatch, getState) => {
    let metrics = getState().metrics;
    foo(dispatch, getState, metrics[0].id, 20)
    .then(() => foo(dispatch, getState, metrics[1].id, 20))
    .then(() => foo(dispatch, getState, metrics[2].id, 20))
    .then(() => foo(dispatch, getState, metrics[0].id, 20))
    .then(() => foo(dispatch, getState, metrics[1].id, 20))
    .then(() => foo(dispatch, getState, metrics[2].id, 20))
    .then(() => foo(dispatch, getState, metrics[0].id, 20))
    .then(() => foo(dispatch, getState, metrics[1].id, 20))
    .then(() => foo(dispatch, getState, metrics[2].id, 20))
    .then(() => foo(dispatch, getState, metrics[0].id, 20))
    .then(() => foo(dispatch, getState, metrics[1].id, 20))
    .then(() => foo(dispatch, getState, metrics[2].id, 20))
    .then(() => foo(dispatch, getState, metrics[0].id, 500))
    .then(() => foo(dispatch, getState, metrics[1].id, 500))
    .then(() => foo(dispatch, getState, metrics[2].id, 500))
    .then(() => foo(dispatch, getState, metrics[0].id, 500))
    .then(() => foo(dispatch, getState, metrics[1].id, 500))
    .then(() => foo(dispatch, getState, metrics[2].id, 500))
    .then(() => foo(dispatch, getState, metrics[0].id, 500))
    .then(() => foo(dispatch, getState, metrics[1].id, 500))
    .then(() => foo(dispatch, getState, metrics[2].id, 500))
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
