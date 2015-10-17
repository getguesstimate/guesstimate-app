import BasicNode from './basic-node.js'
import _ from 'lodash';

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
    return this.childrenIds(id).map(e => this.nodes.find(m => m.id === e))
  }

  parents(id, oneLevel=true) {
    return this.parentIds(id).map(e => this.nodes.find(m => m.id === e))
  }

  childrenIds(id, oneLevel=true) {
    const oneLevelChildren = this.edges.filter(e => e.input === id).map(e => e.output)
    return oneLevel ?
      oneLevelChildren
      :
      _.uniq(_.flattenDeep([oneLevelChildren, oneLevelChildren.map(e => this.childrenIds(e, false))]))
  }

  parentIds(id, oneLevel=true) {
    const oneLevelParents = this.edges.filter(e => e.output === id).map(e => e.input)
    return oneLevel ?
      oneLevelParents
      :
      _.uniq(_.flattenDeep([oneLevelParents, oneLevelParents.map(e => this.parentsIds(e, false))]))
  }
}

