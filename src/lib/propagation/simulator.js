import e from 'gEngine/engine';

export default class Simulator {
  metricId: string;
  propagationId: number;
  graph: Graph;
  simulation: ?Simulation;

  constructor(metricId: string, graph: Graph, propagationId: number) {
    this.metricId = metricId
    this.graph = graph
    this.propagationId = propagationId
  }

  run(n:number) {
    return new Promise(
      (resolve, reject) => {
        e.graph.runSimulation(this.graph, this.metricId, n).then(
          simulation => {
            simulation.propagationId = this.propagationId
            console.log(`Resolving in src/lib/propagation/simulator.js at line 21`)
            resolve(simulation)
          }
        )
      }
    )
  }
}
