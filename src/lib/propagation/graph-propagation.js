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

//TODO: Stop tree where there is an error
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

    this.useGuesstimateForm = graphFilters.useGuesstimateForm || false

    this.orderedMetricIds = this._orderedMetricIds(graphFilters)
    this.orderedMetricPropagations = this.orderedMetricIds.map(id => (new MetricPropagation(id, this.id)))

    this.currentStep = 0

    const remainingPropagationSteps = this.orderedMetricPropagations.map(p => p.remainingSimulations.length)
    this.totalSteps = _.sum(remainingPropagationSteps)
  }

  run(): void {
    this._reset()
    this._propogate()
  }

  _reset(): void {
    this.dispatch(deleteSimulations(this.orderedMetricIds))
  }

  _propogate(): void {
    if (this.currentStep >= this.totalSteps) {
      return
    }
    this._step().then(() => {this._propogate()});
  }

  _step() {
    return new Promise(
      (resolve, reject) => {
        const i = (this.currentStep % this.orderedMetricIds.length)
        this._simulateMetric(this.orderedMetricPropagations[i]).then(
          () => {
            this.currentStep++
            console.log(`Resolving in src/lib/propagation/graph-propagation.js at line 71`)
            resolve()
          }
        )
      }
    )
  }

  _simulateMetric(metricPropagation) {
    return new Promise(
      (resolve, reject) => {
        metricPropagation.step(this._graph(), this.dispatch).then(
          () => { 
            console.log(`Resolving in src/lib/propagation/graph-propagation.js at line 84`)
            resolve() 
          }
        ).catch(
          error => {
            if (error[0]) {
              console.warn('Metric simulation error', error[0], error[1])
            }
            console.log(`Resolving in src/lib/propagation/graph-propagation.js at line 92`)
            resolve()
          }
        )
      }
    )
  }

  _graph(): Graph {
    const state = this.getState()
    let subset = e.space.subset(e.graph.create(state), this.spaceId)

    if (this.useGuesstimateForm) {
      subset = e.graph.toBizarroGraph(subset, state.guesstimateForm);
    }

    return subset
  }

  _orderedMetricIds(graphFilters: object): Array<Object> {
    this.dependencies = e.graph.dependencyTree(this._graph(), graphFilters)
    const inOrder = _.sortBy(this.dependencies, function(n){return n[1]}).map(e => e[0])
    return inOrder
  }
}
