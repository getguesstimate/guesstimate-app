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
  batchStep: number;
  batchSizes: Array<number>;

  constructor(dispatch: Function, getState: Function, metricId: string) {
    this.dispatch = dispatch
    this.getState = getState
    this.metricId = metricId
    this.id = Date.now()
    this.batchSizes = [50, 10000]
    this.batchStep = 0
  }

  run(): void {
    this._reset()
    this._simulate(5) // An initial quick test.
    this._propogate()
  }

  _simulate(n: number): void {
    let simulator = new Simulator(this.metricId, this._graph(), this.id)
    simulator.run(n)
    if (simulator.simulation) {
      this.dispatch(simulator.toDispatch())
    }
  }

  _reset(): void {
    this.dispatch(deleteSimulations([this.metricId]))
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
    this._simulate(this.batchSizes[this.batchStep]);
    this.batchStep++
  }

  _graph(): Graph {
    let state = this.getState()
    return e.graph.toBizarroGraph(e.graph.create(state), state.guesstimateForm);
  }

  _savedSimulation(): Simulation {
    return this.getState().simulations.find(s => s.metric === this.metricId)
  }

  _shouldStop(): Boolean {
    let simulation = this._savedSimulation()

    const hasErrors = e.simulation.hasErrors(simulation)
    const isObsolete = !isRecentPropogation(this.id, simulation)
    const isComplete = (this.batchStep > (this.batchSizes.length - 1))
    const hasNoValues = (simulation.sample.values.length === 0)
    const noUncertainty = hasNoUncertainty(simulation)

    return (hasErrors || isObsolete || isComplete || hasNoValues || noUncertainty)
  }
}
