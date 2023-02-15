import _ from "lodash";
import { mutableCopy, orArr, notIn } from "~/lib/engine/utils";
import {
  NodeAncestors,
  SimulationNodeParams,
  SimulationNodeParamsWithInputs,
} from "../propagation/DAG";
import {
  allInputsWithinFn,
  anyRelationsWithinFn,
  inACycleWithNodeFn,
  getMissingInputs,
} from "./nodeFns";

export type CyclePseudoNode = {
  id: null;
  isCycle: true;
  inputs: string[];
  outputs?: unknown[];
  nodes: SimulationNodeParamsWithInputs[];
};

// Ignores missing inputs.
// TODO - should be generic over node type
export function separateIntoHeightSets(
  nodes: (SimulationNodeParamsWithInputs | CyclePseudoNode)[]
) {
  const missingInputs = getMissingInputs(nodes);
  let unprocessedNodes = [...nodes];
  let heightOrderedNodes: (
    | SimulationNodeParamsWithInputs
    | CyclePseudoNode
  )[][] = [];
  while (unprocessedNodes.length) {
    const nextLevelNodes = _.remove(
      unprocessedNodes,
      allInputsWithinFn(_.flatten(heightOrderedNodes), missingInputs)
    );
    if (!nextLevelNodes.length) {
      console.warn("INFINITE LOOP DETECTED");
      break;
    }
    heightOrderedNodes.push(nextLevelNodes);
  }
  return heightOrderedNodes;
}

export function separateIntoDisconnectedComponents<T extends { id: string }>(
  nodes: T[],
  nodeAncestors: NodeAncestors
) {
  if (_.isEmpty(nodes)) {
    return [];
  }
  let unprocessedNodes = mutableCopy(nodes);
  let components: T[][] = [];
  let currentComponent: T[] = [];
  while (!_.isEmpty(unprocessedNodes)) {
    let newComponentNodes = _.pullAt(unprocessedNodes, [0]);
    do {
      currentComponent.push(...newComponentNodes);
      newComponentNodes = _.remove(
        unprocessedNodes,
        anyRelationsWithinFn(currentComponent, nodeAncestors)
      );
    } while (!_.isEmpty(newComponentNodes));

    components.push(currentComponent);
    currentComponent = [];
  }
  return components;
}

export function getCycleSets(
  nodes: SimulationNodeParamsWithInputs[],
  nodeAncestors: NodeAncestors
) {
  let acyclicNodes = [...nodes];
  let cycleSets: SimulationNodeParamsWithInputs[][] = [];

  let cycleNodes = _.remove(acyclicNodes, ({ id }) =>
    nodeAncestors[id].includes(id)
  );

  while (!_.isEmpty(cycleNodes)) {
    cycleSets.push(
      _.remove(cycleNodes, inACycleWithNodeFn(cycleNodes[0], nodeAncestors))
    );
  }

  return { acyclicNodes, cycleSets };
}

export function toCyclePseudoNode(
  nodes: SimulationNodeParamsWithInputs[]
): CyclePseudoNode {
  const containedIds = nodes.map((n) => n.id);
  return {
    id: null,
    isCycle: true,
    inputs: _.uniq(
      _.flatten(nodes.map((n) => orArr(n.inputs).filter(notIn(containedIds))))
    ),
    outputs: _.uniq(
      _.flatten(nodes.map((n) => orArr(n.outputs).filter(notIn(containedIds))))
    ),
    nodes,
  };
}
