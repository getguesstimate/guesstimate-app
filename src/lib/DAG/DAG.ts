import _ from "lodash";
import { mutableCopy, orArr, notIn } from "gEngine/utils";
import {
  allInputsWithinFn,
  anyRelationsWithinFn,
  inACycleWithNodeFn,
  getMissingInputs,
} from "./nodeFns";

// Ignores missing inputs.
export function separateIntoHeightSets(nodes) {
  const missingInputs = getMissingInputs(nodes);
  let unprocessedNodes = mutableCopy(nodes);
  let heightOrderedNodes: any[] = [];
  while (!_.isEmpty(unprocessedNodes)) {
    const nextLevelNodes = _.remove(
      unprocessedNodes,
      allInputsWithinFn(_.flatten(heightOrderedNodes), missingInputs)
    );
    if (_.isEmpty(nextLevelNodes)) {
      console.warn("INFINITE LOOP DETECTED");
      break;
    }
    heightOrderedNodes.push(nextLevelNodes);
  }
  return heightOrderedNodes;
}

export function separateIntoDisconnectedComponents(nodes, nodeAncestors) {
  if (_.isEmpty(nodes)) {
    return [];
  }
  let unprocessedNodes = mutableCopy(nodes);
  let components: any[] = [];
  let currentComponent: any[] = [];
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

export function getCycleSets(nodes, nodeAncestors) {
  let acyclicNodes = mutableCopy(nodes);
  let cycleSets: any[] = [];

  let cycleNodes: any[] = _.remove(acyclicNodes, ({ id }) =>
    nodeAncestors[id].includes(id)
  );

  while (!_.isEmpty(cycleNodes)) {
    cycleSets.push(
      _.remove(cycleNodes, inACycleWithNodeFn(cycleNodes[0], nodeAncestors))
    );
  }

  return { acyclicNodes, cycleSets };
}

export function toCyclePseudoNode(nodes) {
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
