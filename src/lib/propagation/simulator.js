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
    return e.graph.runSimulation(this.graph, this.metricId, n).then(
      simulation => {
        simulation.propagationId = this.propagationId
        simulation.metric = this.metricId
        return simulation
      }
    )
  }
}
