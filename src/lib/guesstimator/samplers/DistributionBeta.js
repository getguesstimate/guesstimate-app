import {simulate} from './Simulator.js'

export var Sampler = {
  sample({params: [hits, total]}, n, _1) {
    // This treats your entry as a prior, and assumes you are 2 times more confident than
    // a raw beta would be. This gives your distribution more of a peak for small numbers.
    return simulate(`beta(${2*hits},${2*(total-hits)})`, [], n)
  }
}

