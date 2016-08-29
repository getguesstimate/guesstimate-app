import {SimulationDAG} from './simulationDAG.js'

function getNodesToSimulate(DAG, options) {
  if (!!options.simulateId) {
    return [DAG.find(options.simulateId)]
  } else if (!!options.simulateSubsetFrom) {
    return DAG.subsetFrom(options.simulateSubsetFrom)
  } else if (!!options.simulateUnsimulatedAndDescendants) {
    return DAG.subsetFrom(DAG.nodes.filter(n => _.isEmpty(n.samples)).map(n => n.id))
  } else {
    return DAG.nodes
  }
}

export class Simulator {
  constructor(nodes, numSamples, options, propagationId, yieldSims, getCurrPropId) {
    // First, we'll build the DAG from the passed nodes.
    this.DAG = new SimulationDAG(nodes)
    this.nodesToSimulate = getNodesToSimulate(this.DAG, options)
    this.index = 0
    this.numSamples = numSamples
    this.yieldSims = yieldSims
    this.getCurrPropId = getCurrPropId
    this.propagationId = propagationId
  }

  run() {
    window.recorder.recordPropagationStart(this)
    // Building the DAG may incur some graph errors, so we'll extract those first.
    // TODO(matthew): Node functions are currently only available on valid nodes.
    this.DAG.errorNodes.forEach(node => {this.yieldSims(node.id, _.pick(node, ['samples', 'errors']))})
    this._step()
  }

  _step() {
    if (this.index >= this.nodesToSimulate.length) {
      window.recorder.recordPropagationStop(this)
      return
    }
    let node = this.nodesToSimulate[this.index]
    if (this.propagationId < this.getCurrPropId(node.id)) { return } // Break early if we've been pre-empted.
    window.recorder.recordNodeSimulationStart(this, node)
    node.simulate(this.numSamples).then(sim => {
      window.recorder.recordNodeSimulationStop(node)
      this.yieldSims(node.id, sim)
      this.index++
      this._step()
    })
  }
}
