import * as t from './typings'

export function functionDistributionEvaluate(dist: t.FunctionDistribution, inputs: t.FunctionInput[]): t.Sample {
  return {value: 32, errors: []}
}

export function formToGuesstimate(form: t.GuesstimateForm, graph: t.Graph): t.Guesstimate {

}

export interface DGuesstimate extends t.Guesstimate{
  simulations?: t.Simulation[]
}

export function toDGuesstimate(guesstimate: t.Guesstimate, graph: t.Graph): DGuesstimate {

}

export function mostRecentSimlation(guesstimate: t.Guesstimate, guesstimates: t.Guesstimate[]): t.Simulation {

}

export function addSimulations(simulations: t.Simulation[]): t.Simulation {

}
