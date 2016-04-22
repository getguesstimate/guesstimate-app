/* @flow */
import * as graph from './graph';
import * as _guesstimate from './guesstimate';
import type {DGraph, Sample} from './types.js'

//borrowing a function from the graph library
const metric = graph.metric;

export function runSimulation(dGraph:DGraph, metricId:string, n:number) {
  const m = metric(dGraph, metricId);
  if (!m) {
    // TODO(matthew): Change to reject
    return Promise.resolve({errors: ['Unknown metric referenced']})
  }
  return _guesstimate.sample(m.guesstimate, dGraph, n)
}

function metricInputs(metric, dGraph) {
  let inputs = _guesstimate.inputMetrics(metric.guesstimate, dGraph).map(m => m.id)
  return inputs.map( i => { return {output: metric.id, input: i} })
}

export function dependencyMap(dGraph, guesstimateForm = {}) {
  if (_.isUndefined(dGraph)) { return [] }

  let asLists = dGraph.metrics
    .map(m => toBizarroMetric(m, guesstimateForm))
    .map(m => metricInputs(m, dGraph))
  return _.flatten(asLists)
}

function toBizarroMetric(metric, guesstimateForm) {
  if (guesstimateForm.metric === metric.id) { return {...metric, guesstimate: guesstimateForm} }
  else { return metric }
}
