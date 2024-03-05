import { SimulationDAG, SimulationNodeParams } from "./DAG";
import { SimulationNode } from "./node";

export type SimulatorOptions = {
  // mutually exclusive
  simulateIds?: string[];
  simulateStrictSubsetFrom?: string[];
  simulateSubsetFrom?: string[];
};

function getNodesToSimulate(DAG: SimulationDAG, options: SimulatorOptions) {
  if (options.simulateIds) {
    return DAG.nodes.filter(({ id }) => options.simulateIds!.includes(id));
  } else if (options.simulateStrictSubsetFrom) {
    return DAG.strictSubsetFrom(options.simulateStrictSubsetFrom);
  } else if (options.simulateSubsetFrom) {
    return DAG.subsetFrom(options.simulateSubsetFrom);
  } else {
    return DAG.nodes;
  }
}

export class Simulator {
  DAG: SimulationDAG;
  nodesToSimulate: SimulationNode[];
  index: number;
  numSamples: number;
  yieldSims: (nodeId: string, sim: unknown) => void;
  getCurrPropId: (nodeId: string) => number;
  propagationId: number;

  constructor(
    nodes: SimulationNodeParams[],
    numSamples: number,
    options: SimulatorOptions,
    propagationId: number,
    yieldSims: (nodeId: string, sim: unknown) => void,
    getCurrPropId: (nodeId: string) => number
  ) {
    // First, we'll build the DAG from the passed nodes.
    this.DAG = new SimulationDAG(nodes);
    this.nodesToSimulate = getNodesToSimulate(this.DAG, options).filter(
      (n) => !n.skipSimulating
    );
    this.index = 0;
    this.numSamples = numSamples;
    this.yieldSims = yieldSims;
    this.getCurrPropId = getCurrPropId;
    this.propagationId = propagationId;
  }

  run() {
    this._step();
  }

  _step() {
    if (this.index >= this.nodesToSimulate.length) {
      return;
    }
    const node = this.nodesToSimulate[this.index];
    if (this.propagationId < this.getCurrPropId(node.id)) {
      return;
    } // Break early if we've been pre-empted.
    node.simulate(this.numSamples).then((sim) => {
      this.yieldSims(node.id, sim);
      this.index++;
      this._step();
    });
  }
}
