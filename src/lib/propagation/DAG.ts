import _ from "lodash";
import { SimulationNode } from "./node";
import {
  withInfiniteLoopErrorFn,
  withMissingInputErrorFn,
  withAncestralErrorFn,
} from "./errors";

import { getSubMatches } from "gEngine/utils";
import { get, orFns } from "gEngine/collections";

import {
  getCycleSets,
  toCyclePseudoNode,
  separateIntoHeightSets,
} from "lib/DAG/DAG";
import {
  getNodeAncestors,
  containsDuplicates,
  getMissingInputs,
  isDescendedFromFn,
  withInputIndicesFn,
} from "lib/DAG/nodeFns";

const ID_REGEX = /\$\{([^\}]*)\}/g;

function expandCyclesAndAddGraphErrors(component, nodeAncestors) {
  const missingInputs = getMissingInputs(_.flatten(component));

  const withCyclesExpanded = component.map((heightSet) =>
    _.flatten(
      heightSet.map((n) =>
        n.isCycle ? n.nodes.map(withInfiniteLoopErrorFn(n.nodes)) : n
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
  nodeAncestors: any;
  nodes: any;

  constructor(nodes) {
    if (!!_.get(window, "recorder")) {
      window.recorder.recordSimulationDAGConstructionStart(this);
    }

    if (containsDuplicates(nodes)) {
      console.warn("DUPLICATE IDs DETECTED");
      return;
    }

    const withInputs = nodes.map((n) => ({
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

    if (!!_.get(window, "recorder")) {
      window.recorder.recordSimulationDAGConstructionStop(this);
    }
  }

  find(id) {
    return get(this.nodes, id);
  }
  subsetFrom(idSet) {
    return this.nodes.filter(
      orFns(
        (n) => idSet.includes(n.id),
        isDescendedFromFn(idSet, this.nodeAncestors)
      )
    );
  }
  strictSubsetFrom(idSet) {
    return this.nodes.filter(isDescendedFromFn(idSet, this.nodeAncestors));
  }
}
