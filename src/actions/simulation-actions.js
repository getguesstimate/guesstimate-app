import _ from 'lodash';
import e from '../lib/engine/engine';
import async from 'async'

function runSimulation(guesstimate, dGraph, n ) {
  return e.guesstimate.sample(guesstimate, dGraph, n);
}
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
    console.log('dispatching')
    dispatch(addPartialSimulation(simulation))
  }
}

function *cycle(items) {
  let index = -1;
  while(true) {
    index = (index + 1) % items.length;
    yield items[index];
  }
}

function *run(dispatch, getState, metrics, n) {
  let id = cycle(metrics)
  while(true) {
    _runSimulation(dispatch, getState, id.next().value, n);
    yield;
  }
}
function wat(n, doneCallback) {
  console.log(n)
  return doneCallback;
}

export function runSimulations(value, getState) {
  let n = 50000;
  return (dispatch, getState) => {
    let now = new Date;
    let metrics = getState().metrics;
    let metricIds = getState().metrics.map(n => n.id);
    let rr = run(dispatch, getState, metricIds, 500);
    //setTimeout(function(){
    let foobar = (callback) => {
      rr.next()
      setTimeout(function(){
        callback(null, 3),
        10
      })
    }

    let ary = new Array(40).fill(foobar)
    async.series(ary);
  };
}

export function addPartialSimulation(simulation) {
    return { type: 'UPDATE_SIMULATION', simulation};
}
