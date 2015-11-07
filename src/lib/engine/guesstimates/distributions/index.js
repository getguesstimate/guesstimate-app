import {Distribution as NormalDistribution} from './normal.js';
import {Distribution as PointDistribution} from './point.js'

export class _Distribution {
  type(g) {
    const foo = NormalDistribution
    if (NormalDistribution.isA(g)){
      return NormalDistribution
    } else if (PointDistribution.isA(g)){
      return PointDistribution
    } else {
      return false
    }
  }

  isA(g) { return !!this.type(g) }
  simulator(g) { return this.type(g) }
}

export var Distribution = new _Distribution()
