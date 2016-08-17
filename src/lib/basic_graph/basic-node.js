export default class BasicNode {
  constructor(id, graph) {
    this.id = id;
    this.graph = graph;
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
      const parents = _.uniq(_.flatten(this.directParents()))
      if (_.some(parents, node => _.some(nodesToIgnore, s => s.id === node.id))){
        this._maxDistanceFromRoot = Infinity
        return Infinity
      }
      const distances = parents.map(n => n._calculateMaxDistanceFromRoot(nodesToIgnore.concat([this])))

      this._maxDistanceFromRoot = distances.length > 0 ? Math.max(...distances) + 1 : 0
    }
    return this._maxDistanceFromRoot
  }
}
