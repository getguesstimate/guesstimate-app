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

export function Simulate(nodes, globals, options, propagationId, yieldSims, getCurrPropId) {
  // First, we'll build the DAG from the passed nodes.
  let DAG = new SimulationDAG(nodes)
  let nodesToSimulate = getNodesToSimulate(DAG, options)

  // Building the DAG may incur some graph errors, so we'll extract those first.
  DAG.errorNodes.forEach(node => {yieldSims(node.id, _.pick(node, ['samples', 'errors']))})

  // Now we'll step through all the potentially valid nodes and simulate those.
  nodesToSimulate.forEach(node => {
    if (propagationId < getCurrPropId()) { break } // Break early if we've been pre-empted.
    yieldSims(node.id, node.simulate(globals))
  })
}
