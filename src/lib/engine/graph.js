import * as metric from './metric';

//export interface Graph {
  //metrics?: Metric[],
  //guesstimates?: Guesstimate[],
  //simulations?: PartialSimulation[]
//}
//

export function denormalize(graph){
  let metrics = graph.metrics.map(m => metric.denormalize(m, graph));
  return {metrics};
}
