import _ from "lodash";
import {
  CyclePseudoNode,
  getCycleSets,
  separateIntoHeightSets,
  toCyclePseudoNode,
} from "~/lib/DAG/DAG";
import {
  containsDuplicates,
  getMissingInputs,
  getNodeAncestors,
  isDescendedFromFn,
  withInputIndicesFn,
} from "~/lib/DAG/nodeFns";
import { get, orFns } from "~/lib/engine/collections";
import { getSubMatches } from "~/lib/engine/utils";

import { SampleValue } from "../guesstimator/samplers/Simulator";
import {
  PropagationError,
  withAncestralErrorFn,
  withInfiniteLoopErrorFn,
  withMissingInputErrorFn,
} from "./errors";
import { SimulationNode } from "./node";

export type SimulationNodeParams = {
  id: string; // can be null for pseudo cycle nodes
  isCycle?: boolean;
  expression?: string;
  guesstimateType?: string | null | undefined;
  type?: number; // FIXME - enum?
  samples?: SampleValue[];
  errors?: PropagationError[];
  skipSimulating?: boolean;
  inputs?: string[];
  outputs?: unknown[];
  nodes?: SimulationNodeParamsWithInputs[]; // for pseudo cycle nodes
};

export type SimulationNodeParamsWithInputs = Omit<
  SimulationNodeParams,
  "inputs"
> &
  Required<Pick<SimulationNodeParams, "inputs">>;

export type SimulationNodeParamsWithInputIndices =
  SimulationNodeParamsWithInputs & {
    inputIndices: number[];
  };

export type NodeAncestors = { [k: string]: string[] };

const ID_REGEX = /\$\{([^\}]*)\}/g;

function expandCyclesAndAddGraphErrors(
  component: (SimulationNodeParamsWithInputs | CyclePseudoNode)[][],
  nodeAncestors: NodeAncestors
) {
  const missingInputs = getMissingInputs(_.flatten(component));

  const withCyclesExpanded = component.map((heightSet) =>
    _.flatten(
      heightSet.map((n) =>
        n.isCycle
          ? (n as CyclePseudoNode).nodes.map(
              withInfiniteLoopErrorFn((n as CyclePseudoNode).nodes)
            )
          : (n as SimulationNodeParamsWithInputs)
      )
    )
  );
  const withMissingInputErrors = withCyclesExpanded.map((heightSet) =>
    heightSet.map(withMissingInputErrorFn(missingInputs))
  );

  return withMissingInputErrors.map((heightSet) => {
    return heightSet.map(
      withAncestralErrorFn(_.flatten(withMissingInputErrors), nodeAncestors)
    );
  });
}

export class SimulationDAG {
  nodeAncestors: NodeAncestors;
  nodes: SimulationNode[];

  constructor(nodes: SimulationNodeParams[]) {
    if (containsDuplicates(nodes)) {
      console.warn("DUPLICATE IDs DETECTED");
      return;
    }

    const withInputs: SimulationNodeParamsWithInputs[] = nodes.map((n) => ({
      ...n,
      inputs: _.uniq(getSubMatches(n.expression, ID_REGEX, 1)),
    }));

    this.nodeAncestors = getNodeAncestors(withInputs);
    const { acyclicNodes, cycleSets } = getCycleSets(
      withInputs,
      this.nodeAncestors
    );
    const heightSets = separateIntoHeightSets([
      ...acyclicNodes,
      ...cycleSets.map(toCyclePseudoNode),
    ]);
    const processedHeightSets = _.flatten(
      expandCyclesAndAddGraphErrors(heightSets, this.nodeAncestors)
    );
    const withInputIndices = processedHeightSets.map(
      withInputIndicesFn(processedHeightSets)
    );
    this.nodes = withInputIndices.map((n, i) => new SimulationNode(n, this, i));
  }

  find(id: string): SimulationNode | null | undefined {
    return get(this.nodes, id);
  }

  subsetFrom(idSet: string[]) {
    return this.nodes.filter(
      orFns(
        (n) => idSet.includes(n.id),
        isDescendedFromFn(idSet, this.nodeAncestors)
      )
    );
  }

  strictSubsetFrom(idSet: string[]) {
    return this.nodes.filter(isDescendedFromFn(idSet, this.nodeAncestors));
  }
}
