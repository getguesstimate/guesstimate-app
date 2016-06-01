// This was here from when I tried ts.  Not just here for reference.

export interface GridLocation {
  row: number,
  column: number
}

export interface DMetric extends Metric {
  guesstimate: Guesstimate
}

export interface Metric {
  id: string,
  readableId: string,
  location: GridLocation
}

export interface Guesstimate {
  metric: string,
  input: string,
  distribution?: Distribution
}

export interface Distribution { }

export interface EstimateDistribution extends Distribution {
  mean: number,
  stdev: number
}

export interface FunctionDistribution extends Distribution {
  input: string
}

export interface FunctionInput {
  metricId: string,
  readableId: string,
  sample: Sample
}

export interface DGuesstimate extends Guesstimate {
  simulations?: Simulation[]
}

export interface PartialSimulation extends Simulation{
  sample: Sample
}

export interface Simulation {
  metricId: string,
  sample?: Sample
}

export interface Sample {
  values?: number[]
  errors?: string[],
}

export interface Edge {
  input: string,
  output: string
}
export interface Propogation {
  id: string,
  metricId: string,
  graph: Graph,
  sampleCount: number
}

export interface Graph {
  metrics?: Metric[],
  guesstimates?: Guesstimate[],
  simulations?: PartialSimulation[]
}

export interface DGraph {
  metrics: DMetric[]
}
