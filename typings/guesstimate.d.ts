declare module 'guesstimate' {
  import {Graph} from 'graph';

  export interface Distribution {}

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

  export function functionEvaluate(funct: FunctionDistribution, inputs: FunctionInput[]): Sample

  export interface GuesstimateForm {
    metric: string,
    input: string
  }

  export function formToGuesstimate(form: GuesstimateForm, graph: Graph): Guesstimate

  export interface Guesstimate {
    metric: string,
    input: string,
    distribution?: Distribution
  }

  export interface DGuesstimate extends Guesstimate{
    simulations?: Simulation[]
  }

  export function toDGuesstimate(guesstimate: Guesstimate, graph: Graph): DGuesstimate
  export function mostRecentSimlation(guesstimate: Guesstimate, guesstimates: Guesstimate[]): Simulation
  export function addSimulations(simulations: Simulation[]): Simulation

  export interface PartialSimulation {
    samples: Sample[]
  }

  export interface Simulation {
    metricId: string,
    propogationId: string,
  }

  export interface Sample {
    values?: number
    errors?: string[],
  }
}


declare module 'metric' {
  import {Guesstimate} from 'guesstimate';

  export interface GridLocation {
    row: number,
    column: number
  }

  export interface DMetric extends Metric{
    guesstimate: Guesstimate
  }

  export interface Metric {
    id: string,
    readableId: string,
    location: GridLocation
  }
}

declare module 'propogation' {
  import {Graph} from 'graph'
  import {Simulation, PartialSimulation} from 'guesstimate';

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

  export function dependencies(propogation: Propogation[]): string[]

  export class GraphAnalyzer {
    constructor(propogation: Propogation);

    private order: string[];
    private edges: Edge[];

    private findEdges(): void;
    private findOrder(): void;
    next(): PartialSimulation;
  }
}

declare module 'graph' {
    import {Metric, DMetric} from 'metric';
    import {Guesstimate, Simulation, PartialSimulation} from 'guesstimate';

    export interface Graph {
      metrics?: Metric[],
      guesstimates?: Guesstimate[],
      simulations?: PartialSimulation[]
    }

    export function metricInputs(graph: Graph, metricId: string): string[]
    export function metricOutputs(graph: Graph, metricId: string, deep: boolean): string[]

    interface DGraph {
      metrics: DMetric[]
    }

    export function simulate(graph: DGraph, metricId: string): PartialSimulation;

    export function toDGraph(input: Graph): DGraph;
}
