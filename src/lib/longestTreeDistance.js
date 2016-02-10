import _ from 'lodash';

export class LongestDistanceOrderer {
  constructor(edges) {
    this.edges = edges;
    this.maxDistanceList = new Map()
    this.nodes = allNodes(edges)
  }
  run(){
    while(!this._done()){
      this._iterate()
    }
    return Array.from(this.maxDistanceList)
  }
  order(){
    return maxDistanceListToOrder(Array.from(this.maxDistanceList))
  }
  _iterate() {
    this.maxDistanceList = this._nextLayer()
  }
  _done() {
    return allNodesHaveDistances(this.nodes, this.maxDistanceList)
  }
  _distance(node) {
    this.maxDistanceList.get(node)
  }
  _nextLayer() {
    let lists = (Array.from(this.nodes).map(e => [e, maxDistance(this.edges, this.maxDistanceList, e)]))
    return new Map(lists.filter((i) => _.isFinite(i[1])))
  }
}

// Utility Methods
export function allNodes(edges) {
  let set = new Set(_.flatten(edges.map(d => [d.input, d.output])))
  return set
}

export function firstNodes(edges) {
  let _allNodes = allNodes(edges)
  let allOutputs = new Set(edges.map(e => e.output))
  return new Set([..._allNodes].filter(x => !allOutputs.has(x)));
}

export function inputs(edges, node) {
  return edges.filter(e => e.output === node).map(e => e.input)
}

const alreadyProcessed = (node, maxDistanceList) => {return maxDistanceList.has(node)}
const hasNoInputs = (edges, node) => {return (inputs(edges, node).length === 0 )}

function nodeDistances(nodes, maxDistanceList) {
  return Array.from(nodes).map(i => maxDistanceList.get(i))
}

function allNodesHaveDistances(nodes, maxDistanceList) {
  return _.every(nodeDistances(nodes, maxDistanceList), _.isFinite)
}

export function maxDistance(edges, maxDistanceList, node) {

  if (alreadyProcessed(node, maxDistanceList)) {
    return maxDistanceList.get(node)
  } else if (hasNoInputs(edges, node)) {
    return 0
  }

  let _inputs = inputs(edges, node)

  if (allNodesHaveDistances(_inputs, maxDistanceList)) {
    return _.max(nodeDistances(_inputs, maxDistanceList)) + 1
  } else {
    return undefined
  }
}

export function hasNoOutputs(nodeId, edges) {
  return _.some(edges, (d) => (d.output === nodeId))
}

export function maxDistanceListToOrder(maxDistanceList) {
  const sorted = _.sortBy(maxDistanceList, (e => e[1]))
  return sorted.map(e => e[0])
}

