import { SimulationDAG } from "./DAG";

function getNodesToSimulate(DAG: SimulationDAG, options) {
  if (!!options.simulateIds) {
    return DAG.nodes.filter(({ id }) => options.simulateIds.includes(id));
  } else if (!!options.simulateStrictSubsetFrom) {
    return DAG.strictSubsetFrom(options.simulateStrictSubsetFrom);
  } else if (!!options.simulateSubsetFrom) {
    return DAG.subsetFrom(options.simulateSubsetFrom);
  } else {
    return DAG.nodes;
  }
}

export class Simulator {
  DAG: SimulationDAG;
  nodesToSimulate: any;
  index: number;
  numSamples: number;
  yieldSims: any;
  getCurrPropId: any;
  propagationId: number;

  constructor(
    nodes,
    numSamples: number,
    options,
    propagationId: number,
    yieldSims,
    getCurrPropId
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
    window.recorder.recordPropagationStart(this);
    this._step();
  }

  _step() {
    if (this.index >= this.nodesToSimulate.length) {
      window.recorder.recordPropagationStop(this);
      return;
    }
    let node = this.nodesToSimulate[this.index];
    if (this.propagationId < this.getCurrPropId(node.id)) {
      return;
    } // Break early if we've been pre-empted.
    window.recorder.recordNodeSimulationStart(this, node);
    node.simulate(this.numSamples).then((sim) => {
      window.recorder.recordNodeSimulationStop(node);
      this.yieldSims(node.id, sim);
      this.index++;
      this._step();
    });
  }
}
