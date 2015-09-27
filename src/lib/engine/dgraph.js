import * as graph from './graph';
import * as _guesstimate from './guesstimate';

let _metric = graph.metric;

export function runSimulation(dGraph, metricId, n){
  let m = _metric(dGraph, metricId);
  return _guesstimate.sample(m.guesstimate, dGraph, n);
}

