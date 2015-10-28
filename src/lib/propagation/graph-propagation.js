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

function hasNoUncertainty(simulation: Simulation) {
  const v = simulation.sample.values;
  return (_.uniq(_.slice(v, 0, 5)).length === 1)
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

    this.orderedMetricIds = this._orderedMetricIds(graphFilters)
    this.orderedMetricPropagations = this.orderedMetricIds.map(id => (new MetricPropagation(id, this.id)))

    this.currentStep = 0
    this.totalSteps = this.orderedMetricPropagations.length * 3
  }

  run(): void {
    this._reset()
    this._propogate()
  }

  _reset(): void {
    this.dispatch(deleteSimulations(this.orderedMetricIds))
  }

  _propogate(): void {
    async.whilst(
      () => (this.currentStep < this.totalSteps),
      (callback) =>  {
        this._step();
        _.delay(() => {callback(null)}, 1)
      }
    );
  }

  _step(): void {
    let i = (this.currentStep % this.orderedMetricIds.length)
    this._simulateMetric(this.orderedMetricPropagations[i]);
    this.currentStep++
  }

  _simulateMetric(metricPropagation): void {
    const error = metricPropagation.step(this._graph(), this.dispatch)
    if (error[0]) {
      console.error('Metric simulation error', error[0], error[1])
    }
  }

  _graph(): Graph {
    let state = this.getState()
    return e.graph.toBizarroGraph(e.graph.create(state), state.guesstimateForm);
  }

  _orderedMetricIds(graphFilters: object): Array<Object> {
    this.dependencies = e.graph.dependencyTree(this._graph(), graphFilters)
    const inOrder = _.sortBy(this.dependencies, function(n){return n[1]}).map(e => e[0])
    return inOrder
  }
}
