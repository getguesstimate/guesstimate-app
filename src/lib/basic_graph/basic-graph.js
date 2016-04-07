import BasicNode from './basic-node.js'

export default class BasicGraph {
  constructor(nodeIds, edges) {
    this.nodes = nodeIds.map(n => new BasicNode(n, this))
    this.edges = edges
  }

  //TODO: If this is slow, filter edges as well
  subsetFrom(id){
    const itemSubset = [id, ...this.childrenIds(id, false)]
    const edgeSubset = this.edges.filter(e => _.includes(itemSubset, e.input))
    return new BasicGraph(itemSubset, edgeSubset)
  }

  children(id, oneLevel=true) {
    return this.childrenIds(id, oneLevel).map(e => this.nodes.find(m => m.id === e))
  }

  directParents(id) {
    return this.directParentIds(id).map(e => this.nodes.find(m => m.id === e))
  }

  childrenIds(id, oneLevel=true) {
    let descendants = this.edges.filter(e => e.input === id).map(e => e.output)
    if (oneLevel) {return descendants}

    // Now we do a breadth first walk down the edges of the graph, discarding all previously traversed paths.
    let newEdges = this.edges.filter(e => _.some(descendants, d => d === e.input))
    while (newEdges.length > 0) {
      let newDescendants = newEdges.map(e => e.output).filter(nd => !_.some(descendants, d => d === nd))
      descendants = descendants.concat(newDescendants)
      newEdges = this.edges.filter(e => _.some(newDescendants, d => d === e.input))
    }
    return descendants
  }

  directParentIds(id) {
    return this.edges.filter(e => e.output === id).map(e => e.input)
  }
}

