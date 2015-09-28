import * as graph from './graph';
import * as _guesstimate from './guesstimate';

//borrowing a function from the graph library
const metric = graph.metric;

// TODO
// The guesstimate should denormalize if necessary
export function runSimulation(dGraph, metricId, n){
  let m = metric(dGraph, metricId);
  return _guesstimate.sample(m.guesstimate, dGraph, n);
}

