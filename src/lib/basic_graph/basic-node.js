export default class BasicNode {
  constructor(id, graph) {
    this.id = id;
    this.graph = graph;
  }

  children(oneLevel = true) {
    return this.graph.children(this.id, oneLevel)
  }

  parents(oneLevel = true) {
    return this.graph.parents(this.id, oneLevel)
  }

  get maxDistanceFromRoot() {
    if (_.isUndefined(this._maxDistanceFromRoot)) {
      this._maxDistanceFromRoot = this._calculateMaxDistanceFromRoot()
    }
    return this._maxDistanceFromRoot
  }

  _calculateMaxDistanceFromRoot(): integer {
    if (_.isEmpty(this.parents())) {
      return 0
    } else {
      const maxChildDistanceFromRoot = Math.max(...this.parents().map(c => c.maxDistanceFromRoot))
      return (maxChildDistanceFromRoot + 1)
    }
  }
}
