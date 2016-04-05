export default class BasicNode {
  constructor(id, graph) {
    this.id = id;
    this.graph = graph;
  }

  children(oneLevel = true) {
    return this.graph.children(this.id, oneLevel)
  }

  directParents() {
    return this.graph.directParents(this.id)
  }

  get maxDistanceFromRoot() {
    if (_.isUndefined(this._maxDistanceFromRoot)) {
      this._maxDistanceFromRoot = this._calculateMaxDistanceFromRoot()
    }
    return this._maxDistanceFromRoot
  }

  _calculateMaxDistanceFromRoot(): integer {
    // We initialize to -1 as you alwasy get one increment for free in the loop below.
    let distanceFromRoot = -1
    let ancestors = [this]
    while (ancestors.length > 0) {
      distanceFromRoot++
      ancestors = _.uniq(_.flatten(ancestors.map(node => node.directParents())))
      ancestors = ancestors.filter(node => (node.id !== this.id) )
    }
    return distanceFromRoot
  }
}
