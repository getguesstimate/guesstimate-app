import {simulate} from './new/wrapper'

export class GraphPropagation {
  constructor(dispatch: Function, getState: Function, graphFilters: object) {
    this.dispatch = dispatch
    this.getState = getState
    this.graphFilters = graphFilters
  }

  run() {
    simulate(this.dispatch, this.getState, this.graphFilters)
  }
}
