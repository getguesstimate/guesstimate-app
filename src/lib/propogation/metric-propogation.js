/* @flow */

import _ from 'lodash';

import e from 'gEngine/engine';
import type {Simulation, Graph} from '../lib/engine/types.js'
import {addPartialSimulation} from 'gModules/simulations/actions'
import Simulator from './simulator'

function isRecentPropagation(propogationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propogation') || (propogationId >= simulation.propogation)
}

function hasNoUncertainty(simulation: Simulation) {
  const v = simulation.sample.values;
  return (_.uniq(_.slice(v, 0, 5)).length === 1)
}

const hasSimulationErrors = (s) => e.simulation.hasErrors(s)
const hasNoValues = (s) => (_.has(s, 'sample.values') && s.sample.values.length === 0)
const isObsolete = (id, s) => !isRecentPropagation(id, s)

export default class MetricPropagation {
  metricId: string;
  propogationId: number;
  firstPass: boolean;
  remainingSimulations: Array<number>;

  constructor(metricId: string, propagationId: number) {
    this.metricId = metricId
    this.propagationId = propagationId

    this.firstPass = true
    this.remainingSimulations = [5, 500, 5000]
    this.halted = false
  }

  step(graph, dispatch) {
    if (this._needsMoreSamples(graph)) {
      const sampleCount = this.remainingSimulations.shift()
      const simulation = this._simulate(sampleCount, graph, dispatch)
      const errors = this.errors(simulation)
      if (errors[0]) { this.halted = true }
      return errors
    } else {
      return [null, null]
    }
  }


  _needsMoreSamples(graph) {
    if (this.firstPass) { this.firstPass = false; return true }

    const s = this._existingSimulation(graph)
    const isUncertain = !hasNoUncertainty(s)
    const hasRemainingSimulations = (this.remainingSimulations.length > 0)
    const notObsolete = !isObsolete(this.propogationId, s)

    return (isUncertain && hasRemainingSimulations && notObsolete && !this.halted)
  }

  _simulate(sampleCount, graph, dispatch): void {
    let simulator = new Simulator(this.metricId, graph, this.propogationId)
    let {simulation} = simulator.run(sampleCount)
    if (simulation) {
      dispatch(addPartialSimulation(simulation))
    }
    return simulation
  }

  _existingSimulation(graph): Simulation {
    return graph.simulations.find(s => s.metric === this.metricId)
  }

  errors(simulation): Boolean {
    if (hasSimulationErrors(simulation)) {
      return (['SIMULATION_ERROR', e.simulation.errors(simulation) ])
    } else if (hasNoValues(simulation)) {
      return ['NO_VALUES', null]
    } else {
       return [null, null]
    }
  }
}
