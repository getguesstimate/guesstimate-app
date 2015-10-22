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

  run(n:number): void {
    let simulation = e.graph.runSimulation(this.graph, this.metricId, n);
    simulation.propagationId = this.propagationId
    this.simulation = simulation
    return this
  }

  toDispatch(): any{
    return addPartialSimulation(this.simulation)
  }
}
