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
      this._maxDistanceFromRoot = this._calculateMaxDistanceFromRoot([this])
    }
    return this._maxDistanceFromRoot
  }

  _calculateMaxDistanceFromRoot(nodesToIgnore): integer {
    if (_.isUndefined(this._maxDistanceFromRoot)) {
      const ancestors = _.uniq(_.flatten(this.directParents())).filter(node => (!_.some(nodesToIgnore, s => s.id === node.id)))
      const distances = ancestors.map(n => n._calculateMaxDistanceFromRoot(nodesToIgnore.concat([this])))

      this._maxDistanceFromRoot = distances.length > 0 ? Math.max(...distances) + 1 : 0
    }
    debugger
    return this._maxDistanceFromRoot
  }
}
