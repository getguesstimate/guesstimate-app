/* @flow */

import _ from 'lodash'

import e from 'gEngine/engine'
import type {Simulation, Graph} from '../lib/engine/types'
import {addSimulation} from 'gModules/simulations/actions'
import Simulator from './simulator'

import {INFINITE_LOOP_ERROR, INTERNAL_ERROR} from 'lib/errors/modelErrors'

function isRecentPropagation(propagationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propagationId') || (propagationId >= simulation.propagationId)
}

function hasNoUncertainty(simulation: Simulation) {
  if (_.has(simulation, 'sample.values')){
    const v = simulation.sample.values
    return (_.uniq(_.slice(v, 0, 5)).length === 1)
  } else { return false }
}

const hasSimulationErrors = (s) => e.simulation.hasErrors(s)
const hasNoValues = (s) => (_.has(s, 'sample.values') && s.sample.values.length === 0)
const isObsolete = (id, s) => !isRecentPropagation(id, s)
const hasNonNumberValues = (s) => {
  const values = _.get(s, 'sample.values')
  if (values && values.length) {
    const subset = _.slice(values, 0, 5)
    return _.some(subset, v => !_.isFinite(v))
  } else {
    return false
  }
}

export default class MetricPropagation {
  metricId: string;
  propagationId: number;
  firstPass: boolean;
  inInfiniteLoop: boolean;
  remainingSimulations: Array<number>;

  constructor(metricId: string, errors: object, propagationId: number) {
    this.inInfiniteLoop = errors.inInfiniteLoop
    this.metricId = metricId
    this.propagationId = propagationId

    this.firstPass = true
    this.remainingSimulations = [5000]
    this.stepNumber = 0
    this.halted = false
  }

  step(graph, dispatch) {
    if (this.inInfiniteLoop) {
      const simulation = {
        metric: this.metricId,
        propagationId: this.propagationId,
        sample: {
          values: [],
          errors: [{type: INFINITE_LOOP_ERROR, message: 'Infinite loop detected'}],
        }
      }
      this._dispatch(dispatch, simulation)
      this.halted = true
      return Promise.resolve()
    }
    if (this._needsMoreSamples(graph)) {
      const sampleCount = this.remainingSimulations[this.stepNumber]
      return this._simulate(sampleCount, graph, dispatch).then(
        simulation => {
          if (simulation) {
            this._dispatch(dispatch, simulation)

            this.stepNumber++

            const errors = this.errors(simulation)
            if (!_.isEmpty(errors)) { this.halted = true }
          }
        }
      )
    }
    return Promise.resolve()
  }

  _needsMoreSamples(graph) {
    if (this.stepNumber === 0) { return true }

    const s = this._existingSimulation(graph)
    const isUncertain = !hasNoUncertainty(s)
    const hasRemainingSimulations = (this.remainingSimulations.length > this.stepNumber)
    const notObsolete = !isObsolete(this.propagationId, s)

    return (isUncertain && hasRemainingSimulations && notObsolete && !this.halted)
  }

  _simulate(sampleCount, graph, dispatch) {
    return new Promise(
      (resolve, reject) => {
        const simulator = new Simulator(this.metricId, graph, this.propagationId)
        simulator.run(sampleCount).then(simulation => {resolve(simulation)})
      }
    )
  }

  _dispatch(dispatch, simulation) {
    simulation && dispatch(addSimulation(simulation))
  }

  _existingSimulation(graph): Simulation {
    return graph.simulations.find(s => s.metric === this.metricId)
  }

  errors(simulation): Boolean {
    if (hasSimulationErrors(simulation)) {
      return e.simulation.errors(simulation)
    } else if (hasNoValues(simulation)) {
      return [{type: INTERNAL_ERROR, message: 'No samples generated'}]
    } else if (hasNonNumberValues(simulation)) {
      return [{type: INTERNAL_ERROR, message: 'Non numeric samples generated'}]
    } else {
       return []
    }
  }
}
