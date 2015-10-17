/* @flow */

import _ from 'lodash';
import async from 'async'

import e from 'gEngine/engine';
import type {Simulation, Graph} from '../../lib/engine/types.js'
import {addPartialSimulation, deleteSimulations} from 'gModules/simulations/actions'

export class Simulator {
  metricId: string;
  propogationId: number;
  graph: Graph;
  simulation: ?Simulation;

  constructor(metricId: string, graph: Graph, propogationId: number) {
    this.metricId = metricId
    this.graph = graph
    this.propogationId = propogationId
  }

  run(n:number): void {
    let simulation = e.graph.runSimulation(this.graph, this.metricId, n);
    simulation.propogationId = this.propogationId
    this.simulation = simulation
  }

  toDispatch(): any{
    return addPartialSimulation(this.simulation)
  }
}

function isRecentPropogation(propogationId: number, simulation: Simulation) {
  return !_.has(simulation, 'propogation') || (propogationId >= simulation.propogation)
}

function hasNoUncertainty(simulation: Simulation) {
  const v = simulation.sample.values;
  return (_.uniq(_.slice(v, 0, 5)).length === 1)
}

export class FormPropogation {
  dispatch: Function;
  getState: Function;
  metricId: string;
  id: number;
  currentStep: number;
  steps: Array<any>;
  // metricId, samples

  constructor(dispatch: Function, getState: Function, metricId: string) {
    this.dispatch = dispatch
    this.getState = getState
    this.metricId = metricId
    this.id = Date.now()
    this.steps = this._steps(getState(), metricId)
    this.currentStep = 0
  }

  run(): void {
    this._reset()
    this._propogate()
  }

  _simulate(step: Object): void {
    let simulator = new Simulator(step.metricId, this._graph(), this.id)
    simulator.run(step.samples)
    if (simulator.simulation) {
      this.dispatch(simulator.toDispatch())
    }
  }

  _reset(): void {
    this._dependentIds().map(metricId => this.dispatch(deleteSimulations([metricId])))
  }

  _propogate(): void {
    async.whilst(
      () => !this._shouldStop(),
      (callback) =>  {
        this._step();
        _.delay(() => {callback(null)}, 1)
      }
    );
  }

  _step(): void {
    this._simulate(this.steps[this.currentStep]);
    this.currentStep++
  }

  _graph(): Graph {
    let state = this.getState()
    return e.graph.toBizarroGraph(e.graph.create(state), state.guesstimateForm);
  }

  _savedSimulation(): Simulation {
    return this.getState().simulations.find(s => s.metric === this.metricId)
  }

  _dependentIds() {
    return this.dependencies.map(e => e[0])
  }

  _steps(state: Object, metricId: string): Array<Object> {
    const batchSizes = [50, 5000]
    this.dependencies = e.graph.dependencyTree(state, metricId)
    const inOrder = _.sortBy(this.dependencies, function(n){return n[1]}).map(e => e[0])
    const batches = batchSizes.map(samples => { return inOrder.map(metricId => {return {samples, metricId}} ) })
    return _.flattenDeep(batches)
  }

  _shouldStop(): Boolean {
    if (this.currentStep === 0) {
      return false
    }

    let simulation = this._savedSimulation()
    const hasErrors = e.simulation.hasErrors(simulation)
    const hasNoValues = (simulation.sample.values.length === 0)

    const isObsolete = !isRecentPropogation(this.id, simulation)
    const isComplete = (this.currentStep > (this.steps.length - 1))
    const noUncertainty = hasNoUncertainty(simulation)

    return (hasErrors || isObsolete || isComplete || hasNoValues || noUncertainty)
  }
}
