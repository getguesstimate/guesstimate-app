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

  // TODO(Question for Ozzie): Should this be 'maxParentDistanceFromRoot'?
  _calculateMaxDistanceFromRootOld(): integer {
    if (_.isEmpty(this.parents())) {
      return 0
    } else {
      const maxChildDistanceFromRoot = Math.max(...this.parents().map(c => c.maxDistanceFromRoot))
      return (maxChildDistanceFromRoot + 1)
    }
  }

  _calculateMaxDistanceFromRoot(): integer {
    // We initialize to -1 as you alwasy get one increment for free in the loop below.
    let distanceFromRoot = -1
    let ancestors = [this]
    while (ancestors.length > 0) {
      distanceFromRoot++
      ancestors = _.uniq(_.flatten(ancestors.map(e => e.parents())))
      ancestors = ancestors.filter( e => (e.id !== this.id) )
    }
    return distanceFromRoot
  }
}
