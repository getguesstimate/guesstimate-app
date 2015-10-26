/* @flow */
import * as graph from './graph';
import * as _guesstimate from './guesstimate';
import type {DGraph, Sample} from './types.js'

//borrowing a function from the graph library
const metric = graph.metric;

export function runSimulation(dGraph:DGraph, metricId:string, n:number): Sample{
  let m = metric(dGraph, metricId);
  return _guesstimate.sample(m.guesstimate, dGraph, n);
}

function metricInputs(metric, dGraph) {
  let inputs = _guesstimate.inputMetrics(metric.guesstimate, dGraph).map(m => m.id)
  return inputs.map( i => { return {output: metric.id, input: i} })
}

export function dependencyMap(dGraph: DGraph): Array<Object>{
  if (_.isUndefined(dGraph)) { return [] }
  let asLists = dGraph.metrics.map(m => metricInputs(m, dGraph))
  return _.flatten(asLists)
}

