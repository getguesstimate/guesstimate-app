/* @flow */

import _ from 'lodash';
import async from 'async'

import e from 'gEngine/engine';
import type {Simulation, Graph} from '../lib/engine/types.js'
import {deleteSimulations} from 'gModules/simulations/actions'
import MetricPropagation from './metric-propagation.js'

function isRecentPropagation(propagationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propagation') || (propagationId >= simulation.propagation)
}

export class GraphPropagation {
  dispatch: Function;
  getState: Function;
  graphFilters: object;
  id: number;
  currentStep: number;
  steps: Array<any>;
  // metricId, samples

  constructor(dispatch: Function, getState: Function, graphFilters: object) {
    this.dispatch = dispatch
    this.getState = getState
    this.id = Date.now()

    this.spaceId = graphFilters.spaceId

    if (this.spaceId === undefined && graphFilters.metricId) {
      const metric = e.metric.get(getState().metrics, graphFilters.metricId)
      this.spaceId = metric && metric.space
    }

    if (!!this.spaceId) { this.space = getState().spaces.find(s => s.id === this.spaceId) }

    let orderedMetricIdsAndGraphErrors = this._orderedMetricIdsAndErrors(graphFilters)

    this.orderedMetricIds = orderedMetricIdsAndGraphErrors.map(m => m.id)
    this.orderedMetricPropagations = orderedMetricIdsAndGraphErrors.map(
      ({id, errors}) => (new MetricPropagation(id, errors, this.id))
    )

    this.currentStep = 0

    const remainingPropagationSteps = this.orderedMetricPropagations.map(p => p.remainingSimulations.length)
    this.totalSteps = _.sum(remainingPropagationSteps)
  }

  run(): void {
    if (this.currentStep >= this.totalSteps) {
      return
    }
    this._step().then(() => {this.run()});
  }

  _step() {
    const i = (this.currentStep % this.orderedMetricIds.length)
    return this.orderedMetricPropagations[i].step(this._graph(), this.dispatch).then(() => {this.currentStep++})
  }

  _graph(): Graph {
    const state = this.getState()
    const spaceSubset = e.space.subset(e.graph.create(state), this.spaceId, true)
    return e.facts.addFactsToSpaceGraph(spaceSubset, state.facts, this.space)
  }

  _orderedMetricIdsAndErrors(graphFilters: object): Array<Object> {
    this.dependencies = e.graph.dependencyTree(this._graph(), graphFilters)
    const orderedMetrics = _.sortBy(this.dependencies, n => n[1]).map(e => ({
      id: e[0],
      errors: {
        inInfiniteLoop: !_.isFinite(e[1])
      }
    }))
    return orderedMetrics
  }
}
